using AutoMapper;
using Fanex.Data.Repository;
using Fanex.Excel.Models;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface GridService
{
    Task<GridOptions> GetData<TCriteria>(QueryModel queryModel) where TCriteria: CriteriaBase;

    Task<GridOptions> GetDataWithGroup<TCriteria>(QueryModel queryModel) where TCriteria : CriteriaBase;
}

public class GridServiceImp(IDynamicRepository repository,
    GridOptionBuilderService gridService,
    IMapper mapper,
    SortingService sortingService) : GridService
{
    public async Task<GridOptions> GetData<TCriteria>(QueryModel queryModel) where TCriteria : CriteriaBase
    {
        var criteria = mapper.Map<TCriteria>(queryModel);
        var sortDirection = queryModel.SortDirection;
        var sortColumnName = queryModel.SortColumnName;
        var rawData = await repository.FetchMultipleAsync<BaseRawStatisticModel, BaseRawStatisticModel>(criteria);
        var statistics = new ReportModel
        {
            Statistics = GetGroupData(rawData.Item1, IsReportFromSport(queryModel.ReportBy), queryModel.IsGrandTotal),
            GrandTotal = rawData.Item2.FirstOrDefault() ?? new BaseRawStatisticModel()
        };
        if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
        {
            sortingService.SortData(statistics, sortDirection, sortColumnName);
        }
        var result = gridService.BuildGridOptions(statistics, queryModel);
        return result;
    }

    public async Task<GridOptions> GetDataWithGroup<TCriteria>(QueryModel queryModel) where TCriteria : CriteriaBase
    {
        var criteria = mapper.Map<TCriteria>(queryModel);
        var sortDirection = queryModel.SortDirection;
        var sortColumnName = queryModel.SortColumnName;
        var isReportByTop20 = queryModel.ReportBy == ReportByConstant.Top20;
        var rawData = await repository.FetchMultipleAsync<BaseRawStatisticModel, BaseRawStatisticModel>(criteria);
        var statistics = new ReportGroupModel
        {
            Statistics = queryModel.ReportBy == ReportByConstant.Device ? 
                CalculateThreeStatisticsGroup(rawData.Item1, rawData.Item2)
                : CalculateStatisticsGroup(rawData.Item1, rawData.Item2, isReportByTop20),
            GrandTotal = rawData.Item2.FirstOrDefault(x => x.ReportBy is ReportByConstant.GrandTotalRM or ReportByConstant.GrandTotalUSD)
                         ?? new BaseRawStatisticModel()
        };
        if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
        {
            foreach (var item in statistics.Statistics)
            {
                sortingService.SortData(item, sortDirection, sortColumnName);
            }
            
        }
        var result = gridService.BuildGridOptionsWithGroup(statistics, queryModel);
        return result;
    }

    private IEnumerable<ReportModel> CalculateStatisticsGroup(IEnumerable<BaseRawStatisticModel> data, IEnumerable<BaseRawStatisticModel> total, bool isReportByTop20)
    {
        var groupFilters = isReportByTop20
            ?
            [
                new GroupFilterModel(x => x.ReportBy == ReportByConstant.Top20Text, x => x.TopType == ReportByConstant.Top20Text),
                new GroupFilterModel(x => x.ReportBy == ReportByConstant.Bottom20Text, x => x.TopType == ReportByConstant.Bottom20Text)
            ]
            : new List<GroupFilterModel>
            {
                new(x => x.ReportBy == ReportByConstant.CreditGroup, x => !x.IsDeposit),
                new(x => x.ReportBy == ReportByConstant.LicenseeGroup, x => x.IsDeposit)
            };

        return ProcessGroupsWithFilters(data, total, groupFilters, isReportByTop20);
    }

    private IEnumerable<ReportModel> CalculateThreeStatisticsGroup(IEnumerable<BaseRawStatisticModel> data, IEnumerable<BaseRawStatisticModel> total)
    {
        var groupFilters = new List<GroupFilterModel>
        {
            new(x => x.ReportBy == ReportByConstant.Mobile, x => x.ReportById == ReportByConstant.Mobile),
            new(x => x.ReportBy == ReportByConstant.NonMobile, x => x.ReportById == ReportByConstant.NonMobile),
            new(x => x.ReportBy == ReportByConstant.Uncategorized, x => x.ReportById == ReportByConstant.Uncategorized)
        };

        return ProcessGroupsWithFilters(data, total, groupFilters, isGroupByReportBy: true);
    }

    private IEnumerable<ReportModel> ProcessGroupsWithFilters(
        IEnumerable<BaseRawStatisticModel> data,
        IEnumerable<BaseRawStatisticModel> total,
        List<GroupFilterModel> groupFilters,
        bool isGroupByReportBy)
    {
        var groups = new List<ReportModel>();

        if (!data.Any())
        {
            return groups;
        }

        foreach (var filter in groupFilters)
        {
            var groupTotal = total.FirstOrDefault(filter.TotalFilter);
            var groupRawData = data.Where(filter.DataFilter);

            if (groupRawData.Any() && groupTotal != null)
            {
                var group = CalculateGroupStatisticWithTotal(groupRawData, groupTotal, isGroupByReportBy);
                groups.Add(group);
            }
        }

        return groups;
    }

    private ReportModel CalculateGroupStatisticWithTotal(
        IEnumerable<BaseRawStatisticModel> rawData, BaseRawStatisticModel total, bool isGroupByReportBy)
    {
        return isGroupByReportBy
            ? new ReportModel
            {
                Statistics = rawData.GroupBy(g => new { g.ReportBy, g.ReportById }).Select(g => new GroupModel
                {
                    GroupName = g.Key.ReportBy,
                    Statistics = g.ToList()
                }),
                GrandTotal = total
            }
            : new ReportModel
            {
                Statistics = rawData.GroupBy(g => g.SiteId).Select(g => new GroupModel
                {
                    GroupName = g.Key.ToString(),
                    Statistics = g.ToList()
                }),
                GrandTotal = total
            };
    }

    private IEnumerable<GroupModel> GetGroupData(IEnumerable<BaseRawStatisticModel> data, bool isSport, bool isGrandTotal)
    {
        var result = data.GroupBy<BaseRawStatisticModel, object>(
            g => isSport && !isGrandTotal ? g.ReportById : g.ReportBy)
            .Select(g => new GroupModel
            {
                GroupName = g.Key.ToString(),
                Statistics = g.ToList()
            });
        return result;
    }

    private bool IsReportFromSport(string reportBy)
    {
        return reportBy is ReportByConstant.League or ReportByConstant.BetType or ReportByConstant.Sport;
    }
}
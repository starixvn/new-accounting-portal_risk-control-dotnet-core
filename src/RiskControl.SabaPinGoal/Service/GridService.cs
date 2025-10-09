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
            GrandTotal = rawData.Item2.FirstOrDefault()
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
        var groups = new List<ReportModel>();

        if (!data.Any())
        {
            return groups;
        }

        var firstTotal = total.FirstOrDefault(x => x.ReportBy == (isReportByTop20 ? ReportByConstant.Top20Text : ReportByConstant.CreditGroup));
        var firstRawData = data.Where(x => (isReportByTop20 ? x.TopType == ReportByConstant.Top20Text : !x.IsDeposit));
        var secondTotal = total.FirstOrDefault(x => x.ReportBy == (isReportByTop20 ? ReportByConstant.Bottom20Text : ReportByConstant.LicenseeGroup));
        var secondRawData = data.Where(x => (isReportByTop20 ? x.TopType == ReportByConstant.Bottom20Text : x.IsDeposit));

        if (firstRawData.Any())
        {
            var firstGroup = CalculateGroupStatisticWithTotal(firstRawData, firstTotal!, isReportByTop20);
            groups.Add(firstGroup);
        }

        if (secondRawData.Any())
        {
            var secondGroup = CalculateGroupStatisticWithTotal(secondRawData, secondTotal!, isReportByTop20);
            groups.Add(secondGroup);
        }

        return groups;
    }

    private IEnumerable<ReportModel> CalculateThreeStatisticsGroup(IEnumerable<BaseRawStatisticModel> data, IEnumerable<BaseRawStatisticModel> total)
    {
        var groups = new List<ReportModel>();

        if (!data.Any())
        {
            return groups;
        }

        var firstTotal = total.FirstOrDefault(x => x.ReportBy == ReportByConstant.Mobile);
        var firstRawData = data.Where(x => x.ReportById == ReportByConstant.Mobile);
        var secondTotal = total.FirstOrDefault(x => x.ReportBy == ReportByConstant.NonMobile);
        var secondRawData = data.Where(x => x.ReportById == ReportByConstant.NonMobile);
        var thirdTotal = total.FirstOrDefault(x => x.ReportBy == ReportByConstant.Uncategorized);
        var thirdRawData = data.Where(x => x.ReportById == ReportByConstant.Uncategorized);

        if (firstRawData.Any())
        {
            var firstGroup = CalculateGroupStatisticWithTotal(firstRawData, firstTotal!, true);
            groups.Add(firstGroup);
        }

        if (secondRawData.Any())
        {
            var secondGroup = CalculateGroupStatisticWithTotal(secondRawData, secondTotal!, true);
            groups.Add(secondGroup);
        }

        if (thirdRawData.Any())
        {
            var thirdGroup = CalculateGroupStatisticWithTotal(thirdRawData, thirdTotal!, true);
            groups.Add(thirdGroup);
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
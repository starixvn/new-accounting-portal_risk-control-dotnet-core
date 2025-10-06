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
        var rawData = await repository.FetchMultipleAsync<BaseRawStatisticModel, BaseRawStatisticModel>(criteria);
        var statistics = new ReportGroupModel
        {
            Statistics = CalculateStatisticsGroup(rawData.Item1, rawData.Item2),
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

    private IEnumerable<ReportModel> CalculateStatisticsGroup(IEnumerable<BaseRawStatisticModel> data, IEnumerable<BaseRawStatisticModel> total)
    {
        var groups = new List<ReportModel>();

        if (!data.Any())
        {
            return groups;
        }

        var creditTotal = total.FirstOrDefault(x => x.ReportBy == ReportByConstant.CreditGroup);
        var creditRawData = data.Where(x => !x.IsDeposit);
        var depositTotal = total.FirstOrDefault(x => x.ReportBy == ReportByConstant.LicenseeGroup);
        var depositRawData =data.Where(x => x.IsDeposit);

        if (creditRawData.Any())
        {
            var creditGroup = CalculateGroupStatisticWithTotal(creditRawData, creditTotal!);
            groups.Add(creditGroup);
        }

        if (depositRawData.Any())
        {
            var depositGroup = CalculateGroupStatisticWithTotal(depositRawData, depositTotal!);
            groups.Add(depositGroup);
        }

        return groups;
    }

    private ReportModel CalculateGroupStatisticWithTotal(
        IEnumerable<BaseRawStatisticModel> rawData, BaseRawStatisticModel total)
    {
        return new ReportModel
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
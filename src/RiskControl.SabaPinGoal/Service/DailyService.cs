using AutoMapper;
using Fanex.Data.Repository;
using Fanex.Excel.Models;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface DailyService
{
    Task<GridOptions> GetData(QueryModel queryModel);
}

public class DailyServiceImp(IDynamicRepository repository,
    DailyGridOptionBuilderService gridService,
    IMapper mapper,
    SortingService sortingService) : DailyService
{
    public async Task<GridOptions> GetData(QueryModel queryModel)
    {
        var criteria = mapper.Map<DailyCriteria>(queryModel);
        var sortDirection = queryModel.SortDirection;
        var sortColumnName = queryModel.SortColumnName;
        var rawData = await repository.FetchMultipleAsync<BaseRawStatisticModel, BaseRawStatisticModel>(criteria);
        var statistics = new DailyReportModel
        {
            Statistics = GetGroupData(rawData.Item1),
            GrandTotal = rawData.Item2.FirstOrDefault()
        };
        if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
        {
            statistics = sortingService.SortData(statistics, sortDirection, sortColumnName);
        }
        var result = gridService.BuildGridOptions(statistics, queryModel);
        return result;
    }

    private IEnumerable<DailyGroupModel> GetGroupData(IEnumerable<BaseRawStatisticModel> data)
    {
        var result = data.GroupBy(g => g.ReportBy)
            .Select(g => new DailyGroupModel
            {
                GroupName = g.Key,
                DailyStatistics = g.ToList()
            });
        return result;

    }
}
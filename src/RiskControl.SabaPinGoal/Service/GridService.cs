using AutoMapper;
using Fanex.Data.Repository;
using Fanex.Excel.Models;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface GridService
{
    Task<GridOptions> GetData<TCriteria>(QueryModel queryModel) where TCriteria: CriteriaBase;
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
            Statistics = GetGroupData(rawData.Item1, queryModel.ReportBy == ReportByConstant.Product, queryModel.IsGrandTotal),
            GrandTotal = rawData.Item2.FirstOrDefault()
        };
        if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
        {
            statistics = sortingService.SortData(statistics, sortDirection, sortColumnName);
        }
        var result = gridService.BuildGridOptions(statistics, queryModel);
        return result;
    }

    private IEnumerable<GroupModel> GetGroupData(IEnumerable<BaseRawStatisticModel> data, bool isProduct, bool isGrandTotal)
    {
        var result = data.GroupBy<BaseRawStatisticModel, object>(
            g => isProduct && !isGrandTotal ? g.ReportById : g.ReportBy)
            .Select(g => new GroupModel
            {
                GroupName = g.Key.ToString(),
                Statistics = g.ToList()
            });
        return result;
    }
}
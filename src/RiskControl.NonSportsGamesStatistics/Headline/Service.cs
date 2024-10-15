using Fanex.Data.Repository;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public interface Service
{
    Task<BaseViewModel> QueryData(ICriteria criteria, bool hasSubTotal);

    GridOptions BuildGridOpions(BaseViewModel model, BaseRequestModel request, bool isGroup);
}

public class ServiceImp(IDynamicRepository dynamicRepository,
    GridOptionBuilderService gridOptionBuilderService,
    GridOptionRemoveColumnService gridOptionRemoveColumnService) : Service
{
    public async Task<BaseViewModel> QueryData(ICriteria criteria, bool hasSubTotal)
    {
        if (hasSubTotal)
        {
            var rawData = await dynamicRepository.FetchMultipleAsync<StatisticsModel, StatisticsModel, TotalStatisticsModel>(criteria);
            return new BaseViewModel
            {
                Statistics = rawData.Item1,
                SubTotals = rawData.Item2,
                Total = rawData.Item3.FirstOrDefault()
            };
        }
        else
        {
            var rawData = await dynamicRepository.FetchMultipleAsync<StatisticsModel, TotalStatisticsModel>(criteria);
            return new BaseViewModel
            {
                Statistics = rawData.Item1,
                Total = rawData.Item2.FirstOrDefault()
            };
        }
    }


    public GridOptions BuildGridOpions(BaseViewModel model, BaseRequestModel request, bool isGroup)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = request.Title,
            BodyRows = isGroup && !request.IsDrillDown ?
                gridOptionBuilderService.BuildBodyRowsHaveGroup(model.Statistics.ToList(), model.SubTotals.ToList(),
                    request.ViewByInteger, request.IsDrillDown, request.IsGrandTotal)
                : gridOptionBuilderService.BuildBodyRows(model.Statistics.ToList(), request.ViewByInteger, request.IsDrillDown, request.IsGrandTotal, isGroup),
            FooterRows = gridOptionBuilderService.BuildFooter(model.Total, request.ViewByInteger),
            Columns = gridOptionBuilderService.BuildHeaderColumns(request, isGroup, request.IsDrillDown),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false,
            ShowTree = isGroup
        };
        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, request.RemovalColumns);
        return gridOptions;
    }
}
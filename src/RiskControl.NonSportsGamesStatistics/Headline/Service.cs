using Fanex.Data.Repository;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public interface Service
{
    Task<ViewModel> QueryData(ICriteria criteria);

    GridOptions BuildGridOpions(ViewModel model, BaseRequestModel request);
}

public class ServiceImp(IDynamicRepository dynamicRepository, GridOptionBuilderService gridOptionBuilderService) : Service
{
    public async Task<ViewModel> QueryData(ICriteria criteria)
    {
        var rawData = await dynamicRepository.FetchMultipleAsync<StatisticsModel, TotalStatisticsModel>(criteria);
        return new ViewModel
        {
            Statistics = rawData.Item1,
            Total = rawData.Item2.FirstOrDefault()
        };
    }

    public GridOptions BuildGridOpions(ViewModel model, BaseRequestModel request)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = request.Title,
            BodyRows = gridOptionBuilderService.BuildBodyRows(model.Statistics.ToList(), request.ViewByInteger, request.IsDrillDown, request.IsGrandTotal),
            FooterRows = gridOptionBuilderService.BuildFooter(model.Total, request.ViewByInteger),
            Columns = gridOptionBuilderService.BuildHeaderColumns(request),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };
        return gridOptions;
    }
}
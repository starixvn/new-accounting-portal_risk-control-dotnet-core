using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface DailyGridOptionBuilderService
{
    GridOptions BuildGridOptions(DailyReportModel statistics, QueryModel queryModel);
}

public class DailyGridOptionBuilderServiceImp(GridOptionDataRowBuilderService gridOptionDataRowBuilderService,
    GridOptionHeaderBuilderService headerBuilderService,
    GridOptionRemoveColumnService gridOptionRemoveColumnService) : DailyGridOptionBuilderService
{
    public GridOptions BuildGridOptions(DailyReportModel statistics, QueryModel queryModel)
    {
        statistics.GrandTotal.ReportBy = $"Grand Total {statistics.GrandTotal.Currency}";
        statistics.Statistics.ToList().ForEach(item =>
        {
            if (queryModel.IsGrandTotal)
            {
                item.ReportBy = $"Total {item.ReportBy}";
            }
        });
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = statistics.Statistics.Select(s => gridOptionDataRowBuilderService.BuildBaseDataRow(s, false)).ToList(),
            FooterRows = [gridOptionDataRowBuilderService.BuildBaseDataRow(statistics.GrandTotal, true)],
            Columns = headerBuilderService.BuildHeaderColumns(queryModel),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }
}
using System.Collections.Generic;
using System.Linq;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;

public class GridOptionBuilderServiceImp<TQuery>(GridOptionDataRowBuilderService gridDataRowBuilderService,
        GridOptionHeaderBuilderService headerBuilderService,
        GridOptionRemoveColumnService gridOptionRemoveColumnService)
    : GridOptionBuilderService<CurrencyViewStatisticsReportModel, TQuery>
    where TQuery: BaseStatisticQueryModel
{
    public GridOptions BuildGridOptions(CurrencyViewStatisticsReportModel statistics, TQuery queryModel)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRows(statistics.Statistics, queryModel.ViewByInteger),
            FooterRows = BuildFooter(statistics.GrandTotal, queryModel.ViewByInteger),
            Columns = headerBuilderService.BuildGrandTotalHeaderColumns(queryModel.ViewByInteger),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRows(List<DailyViewStatisticsModel> statistics, bool viewByInteger)
    {
        var dataRows = from item in statistics select gridDataRowBuilderService.BuildFullColumnDataRow(item, HAlignment.Left, viewByInteger);
        return dataRows.ToList();
    }

    private List<GridDataRow> BuildFooter(DailyViewStatisticsModel grandTotal, bool viewByInteger)
    {
        var dataRow = gridDataRowBuilderService.BuildFullColumnDataRow(grandTotal, HAlignment.Right, viewByInteger);
        return new List<GridDataRow> { dataRow };
    }
}
using System.Collections.Generic;
using System.Linq;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.CurrencyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;

public interface GridOptionBuilderService
{
    GridOptions BuildGridOptions(CurrencyViewStatisticsReportModel statistics, BaseStatisticQueryModel queryModel, int drillDownCurrency);
}

public class GridOptionBuilderServiceImp(GridOptionDataRowBuilderService gridDataRowBuilderService,
        GridOptionHeaderBuilderService headerBuilderService,
        GridOptionRemoveColumnService gridOptionRemoveColumnService)
    : GridOptionBuilderService
{
    public GridOptions BuildGridOptions(CurrencyViewStatisticsReportModel statistics, BaseStatisticQueryModel queryModel, int drillDownCurrency)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRows(statistics.Statistics, drillDownCurrency, queryModel.ViewByInteger),
            FooterRows = BuildFooter(statistics.GrandTotal, drillDownCurrency, queryModel.ViewByInteger),
            Columns = headerBuilderService.BuildGrandTotalHeaderColumns(drillDownCurrency, queryModel.ViewByInteger),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRows(List<DailyViewStatisticsModel> statistics, int drillDownCurrency, bool viewByInteger)
    {
        var dataRows = from item in statistics select gridDataRowBuilderService.BuildDataRow(item, drillDownCurrency, viewByInteger);
        return dataRows.ToList();
    }

    private List<GridDataRow> BuildFooter(DailyViewStatisticsModel grandTotal, int drillDownCurrency, bool viewByInteger)
    {
        var dataRow = gridDataRowBuilderService.BuildDataRow(grandTotal, drillDownCurrency, viewByInteger);

        if (dataRow != null)
        {
            dataRow.Columns[0].CellAlignment = HAlignment.Right;
        }

        return new List<GridDataRow> { dataRow };
    }
}
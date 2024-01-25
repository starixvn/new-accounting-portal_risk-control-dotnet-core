using System.Collections.Generic;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily;

using System.Linq;

public class GridOptionBuilderServiceImp<TQueryModel>(GridOptionDataRowBuilderService gridDataRowBuilderService,
        GridOptionHeaderBuilderService headerBuilderService,
        GridOptionRemoveColumnService gridOptionRemoveColumnService)
    : GridOptionBuilderService<DailyReportModel, TQueryModel>
    where TQueryModel: BaseStatisticQueryModel
{
    public GridOptions BuildGridOptions(DailyReportModel statistics, TQueryModel queryModel)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRows(statistics.Statistics, queryModel.ViewByInteger),
            FooterRows = BuildFooter(statistics.GrandTotal, queryModel.ViewByInteger),
            Columns = headerBuilderService.BuildHeaderColumns(queryModel),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRows(List<DailyGroupStatisticsModel> statistics, bool viewByInteger)
    {
        var dataRows = new List<GridDataRow>();
        var groupDataRows = statistics.Select(item => gridDataRowBuilderService.BuildDailyGroupDataRow(item, viewByInteger));
        foreach (var groupDataRow in groupDataRows)
        {
            dataRows.AddRange(groupDataRow);
        }

        return dataRows;
    }

    private List<GridDataRow> BuildFooter(DailyViewStatisticsModel grandTotal, bool viewByInteger)
    {
        var dataRow = gridDataRowBuilderService.BuildFullColumnDataRow(grandTotal, HAlignment.Right, viewByInteger);
        return [dataRow];
    }
}
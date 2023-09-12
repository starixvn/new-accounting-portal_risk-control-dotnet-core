using System.Collections.Generic;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;

public class GridOptionBuilderServiceImp<TQueryModel> : GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, TQueryModel>
    where TQueryModel: BaseStatisticQueryModel
{
    private readonly GridOptionDataRowBuilderService gridDataRowBuilderService;
    private readonly GridOptionRemoveColumnService gridOptionRemoveColumnService;
    private readonly GridOptionHeaderBuilderService headerBuilderService;

    public GridOptionBuilderServiceImp(
        GridOptionDataRowBuilderService gridDataRowBuilderService,
        GridOptionHeaderBuilderService headerBuilderService,
        GridOptionRemoveColumnService gridOptionRemoveColumnService)
    {
        this.gridDataRowBuilderService = gridDataRowBuilderService;
        this.headerBuilderService = headerBuilderService;
        this.gridOptionRemoveColumnService = gridOptionRemoveColumnService;
    }

    public GridOptions BuildGridOptions(DailyViewGroupStatisticWithTotalReportModel statistics,
        TQueryModel queryModel)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRows(statistics.GroupStatisticWithTotal, queryModel.ViewByInteger),
            FooterRows = BuildFooter(statistics.GrandTotal, queryModel.ViewByInteger),
            Columns = headerBuilderService.BuildHeaderColumns(queryModel),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false,
            ShowTree = true
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRows(List<DailyViewGroupStatisticsWithTotalModel> statistics,
        bool viewByInteger)
    {
        var dataRows = new List<GridDataRow>();
        foreach (var group in statistics)
        {
            var customGroupAttributes = new { groupId = group.Total.ReportById, groupName = group.Total.ReportBy };
            var totalRow = gridDataRowBuilderService.BuildFullColumnDataRow(group.Total, HAlignment.Left,
                viewByInteger);
            totalRow.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);
            totalRow.RowType = RowType.ParentLevelOne;
            totalRow.Columns.ForEach(x => x.Bold = true);
            foreach (var item in group.Statistics)
            {
                var groupDataRow = gridDataRowBuilderService.BuildDailyViewGroupDataRow(item, viewByInteger);
                totalRow.SubRows.AddRange(groupDataRow);
            }

            dataRows.Add(totalRow);
        }

        return dataRows;
    }

    private List<GridDataRow> BuildFooter(DailyViewStatisticsModel grandTotal, bool viewByInteger)
    {
        var customGroupAttributes = new { groupId = grandTotal.ReportById, groupName = grandTotal.ReportBy };
        var dataRow = gridDataRowBuilderService.BuildFullColumnDataRow(grandTotal, HAlignment.Right, viewByInteger);

        if (dataRow != null)
        {
            dataRow.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);
        }

        return new List<GridDataRow>
        {
            gridDataRowBuilderService.BuildFullColumnDataRow(grandTotal, HAlignment.Right, viewByInteger)
        };
    }
}
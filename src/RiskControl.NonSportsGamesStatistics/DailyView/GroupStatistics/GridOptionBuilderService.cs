using System.Collections.Generic;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;

using System.Linq;

public class GridOptionBuilderServiceImp<TQueryModel>(GridOptionDataRowBuilderService gridDataRowBuilderService,
        GridOptionHeaderBuilderService headerBuilderService,
        GridOptionRemoveColumnService gridOptionRemoveColumnService)
    : GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, TQueryModel>
    where TQueryModel: BaseStatisticQueryModel
{
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
            var groupDataRows = group.Statistics.Select(item => gridDataRowBuilderService.BuildDailyViewGroupDataRow(item, viewByInteger));
            foreach (var groupDataRow in groupDataRows)
            {
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
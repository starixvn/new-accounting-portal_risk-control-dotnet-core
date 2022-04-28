using System.Collections.Generic;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily
{
    public class GridOptionBuilderServiceImp : GridOptionBuilderService<DailyReportModel>
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

        public GridOptions BuildGridOptions(DailyReportModel statistics, BaseStatisticQueryModel queryModel)
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
            foreach (var item in statistics)
            {
                var groupDataRow = gridDataRowBuilderService.BuildDailyGroupDataRow(item, viewByInteger);
                dataRows.AddRange(groupDataRow);
            }

            return dataRows;
        }

        private List<GridDataRow> BuildFooter(DailyViewStatisticsModel grandTotal, bool viewByInteger)
        {
            var dataRow = gridDataRowBuilderService.BuildFullColumnDataRow(grandTotal, HAlignment.Right, viewByInteger);
            return new List<GridDataRow> { dataRow };
        }
    }
}
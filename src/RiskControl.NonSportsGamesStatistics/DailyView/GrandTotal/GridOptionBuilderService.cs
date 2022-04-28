using System.Collections.Generic;
using System.Linq;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal
{
    public class GridOptionBuilderServiceImp : GridOptionBuilderService<CurrencyViewStatisticsReportModel>
    {
        private readonly GridOptionDataRowBuilderService gridDataRowBuilderService;
        private readonly GridOptionHeaderBuilderService headerBuilderService;
        private readonly GridOptionRemoveColumnService gridOptionRemoveColumnService;

        public GridOptionBuilderServiceImp(
            GridOptionDataRowBuilderService gridDataRowBuilderService,
            GridOptionHeaderBuilderService headerBuilderService,
            GridOptionRemoveColumnService gridOptionRemoveColumnService)
        {
            this.gridDataRowBuilderService = gridDataRowBuilderService;
            this.headerBuilderService = headerBuilderService;
            this.gridOptionRemoveColumnService = gridOptionRemoveColumnService;
        }

        public GridOptions BuildGridOptions(CurrencyViewStatisticsReportModel statistics, BaseStatisticQueryModel queryModel)
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
}
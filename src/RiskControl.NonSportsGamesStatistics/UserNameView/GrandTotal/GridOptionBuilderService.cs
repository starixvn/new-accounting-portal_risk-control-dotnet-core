using System.Collections.Generic;
using System.Linq;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.UserNameView.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal
{
    public class GridOptionBuilderServiceImp<TQuery> : GridOptionBuilderService<UserNameViewReportModel, TQuery>
        where TQuery: BaseStatisticQueryModel
    {
        private const int GrandTotalColumnIndex = 0;
        private const int NoOfPlayersColumnIndex = 1;
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

        public GridOptions BuildGridOptions(UserNameViewReportModel statistics, TQuery queryModel)
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
                ShowDistinctRow = false,
                ShowTree = true
            };

            gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

            return gridOptions;
        }

        private List<GridDataRow> BuildBodyRows(List<UserNameViewStatisticsModel> statistics, bool viewByInteger)
        {
            var dataRows = from item in statistics select BuildDataRow(item, HAlignment.Center, viewByInteger);
            return dataRows.ToList();
        }

        private List<GridDataRow> BuildFooter(UserNameViewStatisticsModel grandTotal, bool viewByInteger)
        {
            var dataRow = BuildDataRow(grandTotal, HAlignment.Right, viewByInteger);
            return new List<GridDataRow> { dataRow };
        }

        private GridDataRow BuildDataRow(UserNameViewStatisticsModel statistic, HAlignment alignment, bool viewByInteger)
        {
            var dataRow = gridDataRowBuilderService.BuildBaseDataRow(statistic, viewByInteger);

            if (dataRow != null)
            {
                dataRow.Columns.Insert(GrandTotalColumnIndex, new Columns { Name = "ReportBy", Value = statistic.ReportBy, CellAlignment = alignment });
                dataRow.Columns.Insert(NoOfPlayersColumnIndex, new Columns { Name = "NoOfPlayers", Value = statistic.NoOfPlayers, CellAlignment = HAlignment.Right });
            }

            return dataRow;
        }
    }
}
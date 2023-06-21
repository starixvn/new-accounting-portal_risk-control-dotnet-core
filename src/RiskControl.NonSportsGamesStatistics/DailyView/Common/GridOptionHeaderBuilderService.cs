using System.Collections.Generic;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Common
{
    public interface GridOptionHeaderBuilderService
    {
        List<HeaderColumns> BuildHeaderColumns(BaseStatisticQueryModel queryModel);

        List<HeaderColumns> BuildGrandTotalHeaderColumns(bool viewByInteger);
    }

    public class GridOptionHeaderBuilderServiceImp : GridOptionHeaderBuilderService
    {
        private readonly HeaderTextByReportService headerTextByReportService;

        public GridOptionHeaderBuilderServiceImp(HeaderTextByReportService headerTextByReportService)
        {
            this.headerTextByReportService = headerTextByReportService;
        }

        public List<HeaderColumns> BuildHeaderColumns(BaseStatisticQueryModel queryModel)
        {
            var firstHeaderText = headerTextByReportService.GetHeaderText(queryModel.ReportBy);
            return new List<HeaderColumns>
            {
                new()
                {
                    HeaderText = firstHeaderText, Width = HeaderColumnConstant.WIDTH_200, Name = "ReportBy", Sort = true,
                    SortDirection = queryModel.SortColumnName == "ReportBy" ? queryModel.SortDirection : string.Empty, ShowCollapseExpand = true
                },
                new()
                {
                    HeaderText = "No. Players", Width = HeaderColumnConstant.WIDTH_100, Name = "NoOfPlayers", CustomCellType = ExcelCellType.Integer,
                    Sort = true, SortDirection = queryModel.SortColumnName == "NoOfPlayers" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Bet Count", Width = HeaderColumnConstant.WIDTH_100, Name = "BetCount", CustomCellType = ExcelCellType.Integer,
                    Sort = true, SortDirection = queryModel.SortColumnName == "BetCount" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = HeaderColumnConstant.CURRENCY_TEXT, Width = HeaderColumnConstant.WIDTH_100,
                    Name = HeaderColumnConstant.CURRENCY_TEXT, Sort = true, SortDirection = queryModel.SortColumnName == HeaderColumnConstant.CURRENCY_TEXT ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Total Bets", Width = HeaderColumnConstant.WIDTH_120, Name = "TotalBets", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                    Sort = true, SortDirection = queryModel.SortColumnName == "TotalBets" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Total Wins", Width = HeaderColumnConstant.WIDTH_120, Name = "TotalWins", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                    Sort = true, SortDirection = queryModel.SortColumnName == "TotalWins" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Game Income", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "GameIncome", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                    Sort = true, SortDirection = queryModel.SortColumnName == "GameIncome" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Game Payout", Width = HeaderColumnConstant.WIDTH_120, Name = "GamePayout", CustomCellType = ExcelCellType.Percentage,
                    Sort = true, SortDirection = queryModel.SortColumnName == "GamePayout" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Total Refund", Width = HeaderColumnConstant.WIDTH_120, Name = "TotalRefund", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                    Sort = true, SortDirection = queryModel.SortColumnName == "TotalRefund" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Turnover", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseTurnover", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                    Sort = true, SortDirection = queryModel.SortColumnName == "HouseTurnover" ? queryModel.SortDirection : string.Empty
                },
                 new()
                 {
                    HeaderText = "Real Turnover", Width = HeaderColumnConstant.WIDTH_120, Name = "RealTurnover", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                    Sort = true, SortDirection = queryModel.SortColumnName == "RealTurnover" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Gross Income", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseGrossIncome", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                    Sort = true, SortDirection = queryModel.SortColumnName == "HouseGrossIncome" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Comm", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseComm", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                    Sort = true, SortDirection = queryModel.SortColumnName == "HouseComm" ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = HeaderColumnConstant.EXTRAPT_TEXT, Width = HeaderColumnConstant.WIDTH_120, Name = HeaderColumnConstant.EXTRAPT_TEXT, CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                    Sort = true, SortDirection = queryModel.SortColumnName == HeaderColumnConstant.EXTRAPT_TEXT ? queryModel.SortDirection : string.Empty
                },
                new()
                {
                    HeaderText = "Net Income", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseNetIncome", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                    Sort = true, SortDirection = queryModel.SortColumnName == "HouseNetIncome" ? queryModel.SortDirection : string.Empty
                }
            };
        }

        public List<HeaderColumns> BuildGrandTotalHeaderColumns(bool viewByInteger)
        {
            return new List<HeaderColumns>
            {
                new() {HeaderText = "Grand Total", Width = HeaderColumnConstant.WIDTH_120, Name = "ReportBy"},
                new()
                {
                    HeaderText = "No. Players", Width = HeaderColumnConstant.WIDTH_100,
                    Name = "NoOfPlayers", CustomCellType = ExcelCellType.Integer
                },
                new()
                {
                    HeaderText = "Bet Count", Width = HeaderColumnConstant.WIDTH_100,
                    Name = "BetCount", CustomCellType = ExcelCellType.Integer
                },
                new() {HeaderText = HeaderColumnConstant.CURRENCY_TEXT, Width = HeaderColumnConstant.WIDTH_100, Name = HeaderColumnConstant.CURRENCY_TEXT},
                new()
                {
                    HeaderText = "Total Bets", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "TotalBets", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    HeaderText = "Total Wins", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "TotalWins", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    HeaderText = "Game Income", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "GameIncome", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    HeaderText = "Game Payout", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "GamePayout", CustomCellType = ExcelCellType.Percentage
                },
                new()
                {
                    HeaderText = "Total Refund", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "TotalRefund", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    HeaderText = "Turnover", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "HouseTurnover", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                  new()
                  {
                    HeaderText = "Real Turnover", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "RealTurnover", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    HeaderText = "Gross Income", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "HouseGrossIncome", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    HeaderText = "Comm", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "HouseComm", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                  new()
                  {
                    HeaderText = HeaderColumnConstant.EXTRAPT_TEXT, Width = HeaderColumnConstant.WIDTH_120,
                    Name = HeaderColumnConstant.EXTRAPT_TEXT, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    HeaderText = "Net Income", Width = HeaderColumnConstant.WIDTH_120,
                    Name = "HouseNetIncome", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                }
            };
        }
    }
}
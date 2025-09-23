using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface GridOptionHeaderBuilderService
{
    List<HeaderColumns> BuildHeaderColumns(QueryModel queryModel);

    List<HeaderColumns> BuildGrandTotalHeaderColumns(bool viewByInteger);
}

public class GridOptionHeaderBuilderServiceImp : GridOptionHeaderBuilderService
{
    public List<HeaderColumns> BuildHeaderColumns(QueryModel queryModel)
    {
        return
        [
            new HeaderColumns
            {
                HeaderText = queryModel.HeaderText, Width = HeaderColumnConstant.WIDTH_200, Name = "ReportBy", Sort = true,
                SortDirection = queryModel.SortColumnName == "ReportBy" ? queryModel.SortDirection : string.Empty,
                ShowCollapseExpand = true
            },

            new HeaderColumns
            {
                HeaderText = "No. Players", Width = HeaderColumnConstant.WIDTH_100, Name = "NoOfPlayers",
                CustomCellType = ExcelCellType.Integer,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "NoOfPlayers" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Bet Count", Width = HeaderColumnConstant.WIDTH_100, Name = "BetCount",
                CustomCellType = ExcelCellType.Integer,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "BetCount" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.CURRENCY_TEXT, Width = HeaderColumnConstant.WIDTH_100,
                Name = HeaderColumnConstant.CURRENCY_TEXT, Sort = true,
                SortDirection = queryModel.SortColumnName == HeaderColumnConstant.CURRENCY_TEXT
                    ? queryModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Total Bets", Width = HeaderColumnConstant.WIDTH_120, Name = "TotalBets",
                CustomCellType = ExcelCellType.Double,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "TotalBets" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Total Wins", Width = HeaderColumnConstant.WIDTH_120, Name = "TotalWins",
                CustomCellType = ExcelCellType.Double,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "TotalWins" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Game Income", Width = HeaderColumnConstant.WIDTH_120,
                Name = "GameIncome",
                CustomCellType =  ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "GameIncome" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Game Payout", Width = HeaderColumnConstant.WIDTH_120, Name = "GamePayout",
                CustomCellType = ExcelCellType.Percentage,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "GamePayout" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Real Turnover", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseTurnover",
                CustomCellType = ExcelCellType.Double,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseTurnover" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Gross Income", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseGrossIncome",
                CustomCellType =  ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseGrossIncome"
                    ? queryModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Comm", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseComm",
                CustomCellType = ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseComm" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.EXTRAPT_TEXT, Width = HeaderColumnConstant.WIDTH_120,
                Name = HeaderColumnConstant.EXTRAPT_TEXT,
                CustomCellType = ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == HeaderColumnConstant.EXTRAPT_TEXT
                    ? queryModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Net Income", Width = HeaderColumnConstant.WIDTH_120, Name = "HouseNetIncome",
                CustomCellType = ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseNetIncome" ? queryModel.SortDirection : string.Empty
            }
        ];
    }

    public List<HeaderColumns> BuildGrandTotalHeaderColumns(bool viewByInteger)
    {
        return
        [
            new HeaderColumns { HeaderText = "Grand Total", Width = HeaderColumnConstant.WIDTH_120, Name = "ReportBy" },
            new HeaderColumns
            {
                HeaderText = "No. Players", Width = HeaderColumnConstant.WIDTH_100,
                Name = "NoOfPlayers", CustomCellType = ExcelCellType.Integer
            },

            new HeaderColumns
            {
                HeaderText = "Bet Count", Width = HeaderColumnConstant.WIDTH_100,
                Name = "BetCount", CustomCellType = ExcelCellType.Integer
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.CURRENCY_TEXT, Width = HeaderColumnConstant.WIDTH_100,
                Name = HeaderColumnConstant.CURRENCY_TEXT
            },
            new HeaderColumns
            {
                HeaderText = "Total Bets", Width = HeaderColumnConstant.WIDTH_120,
                Name = "TotalBets", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },

            new HeaderColumns
            {
                HeaderText = "Total Wins", Width = HeaderColumnConstant.WIDTH_120,
                Name = "TotalWins", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },

            new HeaderColumns
            {
                HeaderText = "Game Income", Width = HeaderColumnConstant.WIDTH_120,
                Name = "GameIncome",
                CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },

            new HeaderColumns
            {
                HeaderText = "Game Payout", Width = HeaderColumnConstant.WIDTH_120,
                Name = "GamePayout", CustomCellType = ExcelCellType.Percentage
            },

            new HeaderColumns
            {
                HeaderText = "Turnover", Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseTurnover", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },

            new HeaderColumns
            {
                HeaderText = "Gross Income", Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseGrossIncome",
                CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },

            new HeaderColumns
            {
                HeaderText = "Comm", Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseComm",
                CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.EXTRAPT_TEXT, Width = HeaderColumnConstant.WIDTH_120,
                Name = HeaderColumnConstant.EXTRAPT_TEXT,
                CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },

            new HeaderColumns
            {
                HeaderText = "Net Income", Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseNetIncome",
                CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            }
        ];
    }
}
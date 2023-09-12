using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Common;

public interface GridOptionHeaderBuilderService
{
    List<HeaderColumns> BuildHeaderColumns(BaseStatisticQueryModel queryModel, int drillDownCurrency);

    List<HeaderColumns> BuildGrandTotalHeaderColumns(int drillDownCurrency, bool viewByInteger);
}

public class GridOptionHeaderBuilderServiceImp : GridOptionHeaderBuilderService
{
    public List<HeaderColumns> BuildGrandTotalHeaderColumns(int drillDownCurrency, bool viewByInteger)
    {
        const int CurrencyColumnIndex = 3;
        var reportBy = drillDownCurrency == 0 ? HeaderColumnConstant.CURRENCY_TEXT : "Company";
        var headerColumns = new List<HeaderColumns>
        {
            new() {HeaderText = reportBy, Width = 100, Name = "ReportBy"},
            new()
            {
                HeaderText = "No. Players", Width = 100, Name = "NoOfPlayers", CustomCellType = ExcelCellType.Integer
            },
            new()
            {
                HeaderText = "Bet Count", Width = 100, Name = "BetCount", CustomCellType = ExcelCellType.Integer
            },
            new()
            {
                HeaderText = "Total Bets", Width = 120, Name = "TotalBets", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },
            new()
            {
                HeaderText = "Total Wins", Width = 120, Name = "TotalWins", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },
            new()
            {
                HeaderText = "Game Income", Width = 120, Name = "GameIncome", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },
            new()
            {
                HeaderText = "Game Payout", Width = 120, Name = "GamePayout", CustomCellType = ExcelCellType.Percentage
            },
            new()
            {
                HeaderText = "Total Refund", Width = 120, Name = "TotalRefund", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },
            new()
            {
                HeaderText = "Turnover", Width = 120, Name = "HouseTurnover", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },
            new()
            {
                HeaderText = "Real Turnover", Width = 120, Name = "RealTurnover", CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },
            new()
            {
                HeaderText = "Gross Income", Width = 120, Name = "HouseGrossIncome", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },
            new()
            {
                HeaderText = "Comm", Width = 120, Name = "HouseComm", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },
            new()
            {
                HeaderText = HeaderColumnConstant.EXTRAPT_TEXT, Width = 120, Name = HeaderColumnConstant.EXTRAPT_TEXT, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            },
            new()
            {
                HeaderText = "Net Income", Width = 120, Name = "HouseNetIncome", CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
            }
        };

        if (drillDownCurrency != 0)
        {
            headerColumns.Insert(CurrencyColumnIndex,
                new HeaderColumns { HeaderText = HeaderColumnConstant.CURRENCY_TEXT, Width = HeaderColumnConstant.WIDTH_100, Name = HeaderColumnConstant.CURRENCY_TEXT });
        }

        return headerColumns;
    }

    public List<HeaderColumns> BuildHeaderColumns(BaseStatisticQueryModel queryModel, int drillDownCurrency)
    {
        const int CurrencyColumnIndex = 3;
        var reportBy = drillDownCurrency == 0 ? HeaderColumnConstant.CURRENCY_TEXT : "Company";
        var headerColumns = InitHeaderColumns(reportBy, queryModel);

        if (drillDownCurrency != 0)
        {
            headerColumns.Insert(CurrencyColumnIndex,
                new HeaderColumns
                {
                    HeaderText = HeaderColumnConstant.CURRENCY_TEXT, Width = HeaderColumnConstant.WIDTH_100, Name = HeaderColumnConstant.CURRENCY_TEXT, Sort = true,
                    SortDirection = queryModel.SortColumnName == HeaderColumnConstant.CURRENCY_TEXT ? queryModel.SortDirection : string.Empty
                });
        }

        return headerColumns;
    }

    private static List<HeaderColumns> InitHeaderColumns(string reportBy, BaseStatisticQueryModel queryModel)
    {
        var headerColumns = new List<HeaderColumns>
        {
            new()
            {
                HeaderText = reportBy, Width = 100, Name = "ReportBy", Sort = true,
                SortDirection = queryModel.SortColumnName == "ReportBy" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "No. Players", Width = 100, Name = "NoOfPlayers", CustomCellType = ExcelCellType.Integer,
                Sort = true, SortDirection = queryModel.SortColumnName == "NoOfPlayers" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Bet Count", Width = 100, Name = "BetCount", CustomCellType = ExcelCellType.Integer,
                Sort = true, SortDirection = queryModel.SortColumnName == "BetCount" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Total Bets", Width = 120, Name = "TotalBets", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true, SortDirection = queryModel.SortColumnName == "TotalBets" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Total Wins", Width = 120, Name = "TotalWins", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true, SortDirection = queryModel.SortColumnName == "TotalWins" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Game Income", Width = 120, Name = "GameIncome",
                CustomCellType =
                    queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                Sort = true, SortDirection = queryModel.SortColumnName == "GameIncome" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Game Payout", Width = 120, Name = "GamePayout", CustomCellType = ExcelCellType.Percentage,
                Sort = true, SortDirection = queryModel.SortColumnName == "GamePayout" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Total Refund", Width = 120, Name = "TotalRefund", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true, SortDirection = queryModel.SortColumnName == "TotalRefund" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Turnover", Width = 120, Name = "HouseTurnover", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true, SortDirection = queryModel.SortColumnName == "HouseTurnover" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Real Turnover", Width = 120, Name = "RealTurnover", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true, SortDirection = queryModel.SortColumnName == "RealTurnover" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Gross Income", Width = 120, Name = "HouseGrossIncome", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                Sort = true, SortDirection = queryModel.SortColumnName == "HouseGrossIncome" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Comm", Width = 120, Name = "HouseComm", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                Sort = true, SortDirection = queryModel.SortColumnName == "HouseComm" ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = HeaderColumnConstant.EXTRAPT_TEXT, Width = 120, Name = HeaderColumnConstant.EXTRAPT_TEXT, CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                Sort = true, SortDirection = queryModel.SortColumnName == HeaderColumnConstant.EXTRAPT_TEXT ? queryModel.SortDirection : string.Empty
            },
            new()
            {
                HeaderText = "Net Income", Width = 120, Name = "HouseNetIncome", CustomCellType = queryModel.ViewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative,
                Sort = true, SortDirection = queryModel.SortColumnName == "HouseNetIncome" ? queryModel.SortDirection : string.Empty
            }
        };
        return headerColumns;
    }
}
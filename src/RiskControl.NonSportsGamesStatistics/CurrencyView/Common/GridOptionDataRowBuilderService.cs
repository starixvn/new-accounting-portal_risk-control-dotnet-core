using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using System;
using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Common
{
    public interface GridOptionDataRowBuilderService
    {
        GridDataRow BuildDataRow(DailyViewStatisticsModel statistic, int drillDownCurrency, bool viewByInteger);
    }

    public class GridOptionDataRowBuilderServiceImp : GridOptionDataRowBuilderService
    {
        private readonly GridOptionCustomExcelCellStyleService customCellStyleService;

        public GridOptionDataRowBuilderServiceImp(GridOptionCustomExcelCellStyleService customCellStyleService)
        {
            this.customCellStyleService = customCellStyleService;
        }

        public GridDataRow BuildDataRow(DailyViewStatisticsModel statistic, int drillDownCurrency, bool viewByInteger)
        {
            var gamePayout = viewByInteger
                ? Math.Round(statistic.GamePayout, 0, MidpointRounding.AwayFromZero)
                : statistic.GamePayout;
            const int CurrencyColumnIndex = 3;
            var columns = InitColumns(statistic, viewByInteger, gamePayout);
            if (drillDownCurrency != 0)
            {
                columns.Insert(CurrencyColumnIndex,
                    new Columns { Name = "Currency", Value = statistic.Currency, CellAlignment = HAlignment.Center });
            }

            customCellStyleService.CustomizeGamePayoutColor(columns);

            return new GridDataRow
            {
                Columns = columns
            };
        }

        private static List<Columns> InitColumns(DailyViewStatisticsModel statistic, bool viewByInteger, decimal gamePayout)
        {
            var columns = new List<Columns>
            {
                new()
                {
                    Name = "ReportBy", Value = statistic.ReportBy,
                    CellAlignment = HAlignment.Left, CustomAttributes = statistic.CurrencyId.ToString()
                },
                new()
                {
                    Name = "NoOfPlayers", Value = statistic.NoOfPlayers,
                    CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Integer
                },
                new()
                {
                    Name = "BetCount", Value = statistic.BetCount,
                    CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Integer
                },
                new()
                {
                    Name = "TotalBets", Value = Math.Round(statistic.TotalBets, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    Name = "TotalWins", Value = Math.Round(statistic.TotalWins, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    Name = "GameIncome", Value = Math.Round(statistic.GameIncome, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    Name = "GamePayout", Value = gamePayout/100,
                    CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Percentage
                },
                new()
                {
                    Name = "TotalRefund", Value = Math.Round(statistic.TotalRefund, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    Name = "HouseTurnover", Value = Math.Round(statistic.HouseTurnover, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    Name = "RealTurnover", Value = Math.Round(statistic.RealTurnover, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new()
                {
                    Name = "HouseGrossIncome", Value = Math.Round(statistic.HouseGrossIncome, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    Name = "HouseComm", Value = Math.Round(statistic.HouseComm, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    Name = "ExtraPT", Value = Math.Round(statistic.ExtraPT, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new()
                {
                    Name = "HouseNetIncome", Value = Math.Round(statistic.HouseNetIncome, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                }
            };
            return columns;
        }
    }
}

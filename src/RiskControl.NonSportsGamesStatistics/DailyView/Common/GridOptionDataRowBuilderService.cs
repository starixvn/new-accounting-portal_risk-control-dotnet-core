using System;
using System.Collections.Generic;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Common
{
    public interface GridOptionDataRowBuilderService
    {
        GridDataRow BuildFullColumnDataRow(DailyViewStatisticsModel statistic, HAlignment alignment, bool viewByInteger);

        GridDataRow BuildBaseDataRow(StatisticModel statistic, bool viewByInteger);

        List<GridDataRow> BuildDailyGroupDataRow(DailyGroupStatisticsModel dailyStatistics, bool viewByInteger);

        List<GridDataRow> BuildDailyViewGroupDataRow(DailyViewGroupStatisticsModel dailyViewStatistics,
            bool viewByInteger);
    }

    public class GridOptionDataRowBuilderServiceImp : GridOptionDataRowBuilderService
    {
        private readonly GridOptionCustomExcelCellStyleService customCellStyleService;

        public GridOptionDataRowBuilderServiceImp(GridOptionCustomExcelCellStyleService customCellStyleService)
        {
            this.customCellStyleService = customCellStyleService;
        }

        public GridDataRow BuildFullColumnDataRow(DailyViewStatisticsModel statistic, HAlignment alignment,
            bool viewByInteger)
        {
            var reportByColumnIndex = 0;
            var dataRow = BuildBaseDataRow(statistic, viewByInteger);
            dataRow.Columns.Insert(reportByColumnIndex++,
                new Columns { Name = "ReportBy", Value = statistic.ReportBy, CellAlignment = alignment });
            dataRow.Columns.Insert(reportByColumnIndex,
                new Columns
                {
                    Name = "NoOfPlayers",
                    Value = statistic.NoOfPlayers,
                    CellAlignment = HAlignment.Right,
                    CustomCellType = ExcelCellType.Integer
                });
            return dataRow;
        }

        public GridDataRow BuildBaseDataRow(StatisticModel statistic, bool viewByInteger)
        {
            var gamePayout = viewByInteger
                ? Math.Round(statistic.GamePayout, 0, MidpointRounding.AwayFromZero)
                : statistic.GamePayout;
            var columns = InitColumns(statistic, viewByInteger, gamePayout);

            customCellStyleService.CustomizeGamePayoutColor(columns);

            return new GridDataRow
            {
                Columns = columns
            };
        }

        private static List<Columns> InitColumns(StatisticModel statistic, bool viewByInteger, decimal gamePayout)
        {
            var columns = new List<Columns>
            {
                new Columns
                {
                    Name = "BetCount", Value = statistic.BetCount,
                    CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Integer
                },
                new Columns
                {
                    Name = "Currency", Value = statistic.Currency,
                    CellAlignment = HAlignment.Center, CustomAttributes = statistic.CurrencyId.ToString()
                },
                new Columns
                {
                    Name = "TotalBets", Value = Math.Round(statistic.TotalBets, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new Columns
                {
                    Name = "TotalWins", Value = Math.Round(statistic.TotalWins, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new Columns
                {
                    Name = "GameIncome", Value = Math.Round(statistic.GameIncome, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new Columns
                {
                    Name = "GamePayout", Value = gamePayout/100,
                    CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Percentage
                },
                new Columns
                {
                    Name = "TotalRefund", Value = Math.Round(statistic.TotalRefund, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new Columns
                {
                    Name = "HouseTurnover", Value = Math.Round(statistic.HouseTurnover, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                  new Columns
                {
                    Name = "RealTurnover", Value = Math.Round(statistic.RealTurnover, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
                },
                new Columns
                {
                    Name = "HouseGrossIncome", Value = Math.Round(statistic.HouseGrossIncome, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new Columns
                {
                    Name = "HouseComm", Value = Math.Round(statistic.HouseComm, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new Columns
                {
                    Name = "ExtraPT", Value = Math.Round(statistic.ExtraPT, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                },
                new Columns
                {
                    Name = "HouseNetIncome", Value = Math.Round(statistic.HouseNetIncome, 2, MidpointRounding.AwayFromZero),
                    CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.IntegerRedNegative : ExcelCellType.DoubleRedNegative
                }
            };
            return columns;
        }

        public List<GridDataRow> BuildDailyGroupDataRow(DailyGroupStatisticsModel dailyStatistics, bool viewByInteger)
        {
            var dataRows = new List<GridDataRow>();
            var groupLength = dailyStatistics.DailyStatistics.Count;
            for (var i = 0; i < groupLength; i++)
            {
                var item = dailyStatistics.DailyStatistics[i];
                var dataRow = BuildBaseDataRow(item, viewByInteger);
                dataRow.Columns.Insert(0,
                    new Columns
                    {
                        Name = "NoOfPlayers",
                        Value = item.NoOfPlayers,
                        CellAlignment = HAlignment.Right,
                        CustomCellType = ExcelCellType.Integer
                    });
                string groupName = $"{dailyStatistics.GroupName:MMM dd, yyyy}";
                var customGroupAttributes = new { groupName };
                dataRow.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);

                if (i == 0)
                {
                    dataRow.Columns.Insert(0,
                        new Columns
                        {
                            Name = "ReportBy",
                            Value = groupName,
                            CellAlignment = HAlignment.Left,
                            MergeRowNumber = groupLength
                        });
                }

                dataRows.Add(dataRow);
            }

            return dataRows;
        }

        public List<GridDataRow> BuildDailyViewGroupDataRow(DailyViewGroupStatisticsModel dailyViewStatistics,
            bool viewByInteger)
        {
            var dataRows = new List<GridDataRow>();
            var groupLength = dailyViewStatistics.DailyViewStatistics.Count;
            for (var i = 0; i < groupLength; i++)
            {
                var item = dailyViewStatistics.DailyViewStatistics[i];
                var dataRow = BuildBaseDataRow(item, viewByInteger);
                dataRow.Columns.Insert(0,
                    new Columns
                    {
                        Name = "NoOfPlayers",
                        Value = item.NoOfPlayers,
                        CellAlignment = HAlignment.Right,
                        CustomCellType = ExcelCellType.Integer
                    });
                var customGroupAttributes = new
                {
                    groupId = dailyViewStatistics.GroupId,
                    groupName = dailyViewStatistics.GroupName
                };
                dataRow.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);

                if (i == 0)
                {
                    dataRow.Columns.Insert(0,
                        new Columns
                        {
                            Name = "ReportBy",
                            Value = dailyViewStatistics.GroupName,
                            CellAlignment = HAlignment.Left,
                            MergeRowNumber = groupLength
                        });
                }

                dataRows.Add(dataRow);
            }

            return dataRows;
        }
    }
}
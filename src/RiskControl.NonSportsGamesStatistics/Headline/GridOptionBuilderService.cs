using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System;
using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public interface GridOptionBuilderService
{
    List<GridDataRow> BuildBodyRows(List<StatisticsModel> statistics, bool viewByInteger, bool isDrillDown,
        bool isGrandTotal);

    List<GridDataRow> BuildFooter(TotalStatisticsModel grandTotal, bool viewByInteger);

    List<HeaderColumns> BuildHeaderColumns(BaseRequestModel basicRequestModel);
}

public class GridOptionBuilderServiceImp(GridOptionCustomExcelCellStyleService customCellStyleService) : GridOptionBuilderService
{
    private const int mergedColNumberGrandTotal = 2;

    public List<GridDataRow> BuildBodyRows(List<StatisticsModel> statistics, bool viewByInteger, bool isDrillDown, bool isGrandTotal)
    {
        var dataRows = new List<GridDataRow>();
        if (isDrillDown && !isGrandTotal)
        {
            var index = 0;
            foreach (var item in statistics)
            {
                var row = BuildBaseDataRow(item, viewByInteger);
                if (index == 0)
                {
                    row.Columns.Insert(0,
                        new Columns
                        {
                            Name = "CustId",
                            Value = item.CustId,
                            CellAlignment = HAlignment.Right,
                            CustomAttributes = item.CustId.ToString(),
                            MergeRowNumber = statistics.Count
                        });
                    row.Columns.Insert(0,
                        new Columns
                        {
                            Name = "UserName",
                            Value = item.UserName,
                            CellAlignment = HAlignment.Left,
                            CustomAttributes = item.UserName,
                            MergeRowNumber = statistics.Count
                        });
                }

                index++;
                dataRows.Add(row);
            }
        }
        else
        {
            foreach (var item in statistics)
            {
                var row = BuildBaseDataRow(item, viewByInteger);
                row.Columns.Insert(0,
                    new Columns
                    {
                        Name = "CustId",
                        Value = item.CustId,
                        CellAlignment = HAlignment.Right,
                        CustomAttributes = item.CustId.ToString()
                    });
                row.Columns.Insert(0,
                    new Columns
                    {
                        Name = "UserName",
                        Value = isGrandTotal ? $"Total {item.UserName}" : item.UserName,
                        CellAlignment = HAlignment.Left,
                        CustomAttributes = item.UserName
                    });
                var customGroupAttributes = new
                {
                    custId = item.CustId,
                    userName = item.UserName
                };
                row.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);
                dataRows.Add(row);
            }
        }

        return dataRows;
    }

    public List<GridDataRow> BuildFooter(TotalStatisticsModel grandTotal, bool viewByInteger)
    {
        var dataRow = BuildBaseDataRow(grandTotal, viewByInteger);
        dataRow.Columns.Insert(0,
            new Columns { Name = "UserName", Value = "Grand Total RM", CellAlignment = HAlignment.Right, MergeColNumber = mergedColNumberGrandTotal });
        return [dataRow];
    }

    private GridDataRow BuildBaseDataRow(BaseModel statistic, bool viewByInteger)
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

    public List<HeaderColumns> BuildHeaderColumns(BaseRequestModel basicRequestModel)
    {
        return
        [
            new HeaderColumns
            {
                HeaderText = basicRequestModel.IsGrandTotal ? "Grand Total" : "Headline",
                Width = HeaderColumnConstant.WIDTH_200,
                Name = "UserName",
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "UserName" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "CustId",
                Width = HeaderColumnConstant.WIDTH_100,
                Name = "CustId",
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "CustId" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Bet Count",
                Width = HeaderColumnConstant.WIDTH_100,
                Name = "BetCount",
                CustomCellType = ExcelCellType.Integer,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "BetCount" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.CURRENCY_TEXT,
                Width = HeaderColumnConstant.WIDTH_100,
                Name = HeaderColumnConstant.CURRENCY_TEXT,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == HeaderColumnConstant.CURRENCY_TEXT
                    ? basicRequestModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Total Bets",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "TotalBets",
                CustomCellType = basicRequestModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "TotalBets" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Game Income",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "GameIncome",
                CustomCellType = basicRequestModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "GameIncome" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Game Payout",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "GamePayout",
                CustomCellType = ExcelCellType.PercentageRedPositive,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "GamePayout" ? basicRequestModel.SortDirection : string.Empty
            },


            new HeaderColumns
            {
                HeaderText = "Real Turnover",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "RealTurnover",
                CustomCellType = basicRequestModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "RealTurnover" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Gross Income",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseGrossIncome",
                CustomCellType = basicRequestModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "HouseGrossIncome"
                    ? basicRequestModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Comm",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseComm",
                CustomCellType = basicRequestModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "HouseComm" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.EXTRAPT_TEXT,
                Width = HeaderColumnConstant.WIDTH_120,
                Name = HeaderColumnConstant.EXTRAPT_TEXT,
                CustomCellType = basicRequestModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == HeaderColumnConstant.EXTRAPT_TEXT
                    ? basicRequestModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Net Income",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseNetIncome",
                CustomCellType = basicRequestModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "HouseNetIncome" ? basicRequestModel.SortDirection : string.Empty
            }
        ];
    }

    private static List<Columns> InitColumns(BaseModel statistic, bool viewByInteger, decimal gamePayout)
    {
        var columns = new List<Columns>
        {
            new()
            {
                Name = "BetCount", Value = statistic.BetCount,
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Integer
            },
            new()
            {
                Name = "Currency", Value = statistic.Currency,
                CellAlignment = HAlignment.Center, CustomAttributes = statistic.CurrencyId.ToString()
            },
            new()
            {
                Name = "TotalBets", Value = Math.Round(statistic.TotalBets, 2, MidpointRounding.AwayFromZero),
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
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.PercentageRedPositive
            },
            new()
            {
                Name = "RealTurnover", Value = Math.Round(statistic.RealTurnOver, 2, MidpointRounding.AwayFromZero),
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
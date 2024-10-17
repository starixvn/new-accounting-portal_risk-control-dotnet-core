using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public interface GridOptionBuilderService
{
    List<GridDataRow> BuildBodyRows(List<StatisticsModel> statistics, bool viewByInteger, bool isDrillDown,
        bool isGrandTotal, bool isSMA);

    List<GridDataRow> BuildBodyRowsHaveGroup(List<StatisticsModel> statistics, List<StatisticsModel> subTotals, bool viewByInteger, bool isDrillDown,
        bool isGrandTotal);

    List<GridDataRow> BuildFooter(TotalStatisticsModel grandTotal, bool viewByInteger);

    List<HeaderColumns> BuildHeaderColumns(BaseRequestModel basicRequestModel, bool isGroup, bool isDrillDown);
}

public class GridOptionBuilderServiceImp(GridOptionCustomExcelCellStyleService customCellStyleService) : GridOptionBuilderService
{
    private const int mergedColNumberGrandTotal = 2;
    private const string CustIdColumnName = "CustId";
    private const string UserNameColumnName = "UserName";

    public List<GridDataRow> BuildBodyRows(List<StatisticsModel> statistics, bool viewByInteger, bool isDrillDown, bool isGrandTotal, bool isSMA)
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
                            Name = CustIdColumnName,
                            Value = item.CustId??string.Empty,
                            CellAlignment = HAlignment.Right,
                            CustomAttributes = item.CustId,
                            MergeRowNumber = statistics.Count
                        });
                    row.Columns.Insert(0,
                        new Columns
                        {
                            Name = UserNameColumnName,
                            Value = isSMA ? item.RoleName : item.UserName,
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
                        Name = CustIdColumnName,
                        Value = item.CustId??string.Empty,
                        CellAlignment = HAlignment.Right,
                        CustomAttributes = item.CustId
                    });
                row.Columns.Insert(0,
                    new Columns
                    {
                        Name = UserNameColumnName,
                        Value = AddTotalText(item.UserName, isGrandTotal),
                        CellAlignment = HAlignment.Left,
                        CustomAttributes = item.UserName
                    });
                var customGroupAttributes = new
                {
                    custId = item.CustId,
                    userName = item.UserName,
                    roleId = 0
                };
                row.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);
                dataRows.Add(row);
            }
        }

        return dataRows;
    }

    public List<GridDataRow> BuildBodyRowsHaveGroup(List<StatisticsModel> statistics, List<StatisticsModel> subTotals, bool viewByInteger, bool isDrillDown, bool isGrandTotal)
    {
        var dataRows = new List<GridDataRow>();
        if (subTotals.Count == 0)
        {
            return dataRows;
        }
        var rows = subTotals.Select(subTotal =>
        {
            var row = BuildBaseDataRow(subTotal, viewByInteger);
            row.Columns.Insert(0,
                new Columns
                {
                    Name = CustIdColumnName,
                    Value = subTotal.CustId??string.Empty,
                    CellAlignment = HAlignment.Right,
                    CustomAttributes = subTotal.CustId
                });
            row.Columns.Insert(0,
                new Columns
                {
                    Name = UserNameColumnName,
                    Value = AddTotalText(subTotal.RoleName, isGrandTotal),
                    CellAlignment = HAlignment.Left,
                    CustomAttributes = subTotal.RoleName
                });
            var customGroupAttributes = new
            {
                custId = 0,
                userName = subTotal.RoleName,
                roleId = GetRoleId(subTotal.RoleName.Trim().ToLower(CultureInfo.CurrentCulture))
            };
            row.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);
            var subItems = statistics.Where(s => s.RoleName == subTotal.RoleName);
            if (subItems.Any())
            {
                var subRows = subItems.Select(subItem =>
                {
                    var subRow = BuildBaseDataRow(subItem, viewByInteger);
                    subRow.Columns.Insert(0,
                        new Columns
                        {
                            Name = CustIdColumnName,
                            Value = subItem.CustId??string.Empty,
                            CellAlignment = HAlignment.Right,
                            CustomAttributes = subItem.CustId
                        });
                    subRow.Columns.Insert(0,
                        new Columns
                        {
                            Name = UserNameColumnName,
                            Value = AddTotalText(subItem.UserName, isGrandTotal),
                            CellAlignment = HAlignment.Left,
                            CustomAttributes = subItem.UserName
                        });
                    return subRow;
                });
                row.SubRows.AddRange(subRows);
            }

            return row;
        });
        dataRows.AddRange(rows);

        return dataRows;
    }

    public List<GridDataRow> BuildFooter(TotalStatisticsModel grandTotal, bool viewByInteger)
    {
        var dataRow = BuildBaseDataRow(grandTotal, viewByInteger);
        dataRow.Columns.Insert(0,
            new Columns { Name = UserNameColumnName, Value = "Grand Total RM", CellAlignment = HAlignment.Right, MergeColNumber = mergedColNumberGrandTotal });
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

    public List<HeaderColumns> BuildHeaderColumns(BaseRequestModel basicRequestModel, bool isGroup, bool isDrillDown)
    {
        var firstColumnText = isGroup ? "Username" : "Headline";
        if (isGroup && isDrillDown)
        {
            firstColumnText = "Account Level";
        }
        return
        [
            new HeaderColumns
            {
                HeaderText = basicRequestModel.IsGrandTotal ? "Grand Total" : firstColumnText,
                Width = HeaderColumnConstant.WIDTH_200,
                Name = UserNameColumnName,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "UserName" ? basicRequestModel.SortDirection : string.Empty,
                ShowCollapseExpand = isGroup
            },

            new HeaderColumns
            {
                HeaderText = "CustID",
                Width = HeaderColumnConstant.WIDTH_100,
                Name = CustIdColumnName,
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
                HeaderText = "Total Wins",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "TotalWins",
                CustomCellType = basicRequestModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "TotalWins" ? basicRequestModel.SortDirection : string.Empty
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
                HeaderText = "Total Refund",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "TotalRefund",
                CustomCellType = basicRequestModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "TotalRefund" ? basicRequestModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Turnover",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseTurnover",
                CustomCellType = basicRequestModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = !basicRequestModel.IsGrandTotal,
                SortDirection = basicRequestModel.SortColumnName == "HouseTurnover" ? basicRequestModel.SortDirection : string.Empty
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
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.PercentageRedPositive
            },
            new()
            {
                Name = "TotalRefund", Value = Math.Round(statistic.TotalRefund, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
            },
            new()
            {
                Name = "HouseTurnover", Value = Math.Round(statistic.HouseTurnOver, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = viewByInteger ? ExcelCellType.Integer : ExcelCellType.Double
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

    private static int GetRoleId(string userName)
    {
        var result = userName switch
        {
            "agent" => 2,
            "master" => 3,
            "super" => 4,
            "member" => 1,
            _ => 0
        };
        return result;
    }

    private static string AddTotalText(string text, bool isGrandTotal)
    {
        return isGrandTotal ? $"Total {text}" : text;
    }
}
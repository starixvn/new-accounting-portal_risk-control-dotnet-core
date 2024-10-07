using Fanex.Data.Repository;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using MathNet.Numerics.Statistics;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline.Main;

public interface Service
{
    Task<ViewModel> QueryData(Criteria criteria);

    GridOptions BuildGridOpions(ViewModel model, Request request);
}

public class ServiceImp(IDynamicRepository dynamicRepository, GridOptionCustomExcelCellStyleService customCellStyleService) : Service
{
    private const int mergedColNumberGrandTotal = 2;

    public async Task<ViewModel> QueryData(Criteria criteria)
    {
        var rawData = await dynamicRepository.FetchMultipleAsync<StatisticsModel, TotalStatisticsModel>(criteria);
        return new ViewModel
        {
            Statistics = rawData.Item1,
            Total = rawData.Item2.FirstOrDefault()
        };
    }

    public GridOptions BuildGridOpions(ViewModel model, Request request)
    {
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = request.Title,
            BodyRows = BuildBodyRows(model.Statistics.ToList(), request.ViewByInteger),
            FooterRows = BuildFooter(model.Total, request.ViewByInteger),
            Columns = BuildHeaderColumns(request),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };
        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRows(List<StatisticsModel> statistics, bool viewByInteger)
    {
        var dataRows = new List<GridDataRow>();
        foreach (var item in statistics)
        {
            var row = BuildBaseDataRow(item, viewByInteger);
            row.Columns.Insert(0,
                new Columns
                {
                    Name = "CustId",
                    Value = item.CustId,
                    CellAlignment = HAlignment.Right,
                    CustomCellType = ExcelCellType.Integer
                });
            row.Columns.Insert(0,
                new Columns
                {
                    Name = "UserName",
                    Value = item.CustId,
                    CellAlignment = HAlignment.Left,
                    CustomAttributes = item.CustId.ToString()
                });
            dataRows.Add(row);
        }

        return dataRows;
    }

    private List<GridDataRow> BuildFooter(TotalStatisticsModel grandTotal, bool viewByInteger)
    {
        var dataRow = BuildBaseDataRow(grandTotal, viewByInteger);
        dataRow.Columns.Insert(0,
            new Columns { Name = "ReportBy", Value = grandTotal.ReportBy, CellAlignment = HAlignment.Right, MergeColNumber = mergedColNumberGrandTotal });
        return [dataRow];
    }

    public GridDataRow BuildBaseDataRow(BasicModel statistic, bool viewByInteger)
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

    private static List<HeaderColumns> BuildHeaderColumns(Request queryModel)
    {
        return
        [
            new HeaderColumns
            {
                HeaderText = "Group Headline",
                Width = HeaderColumnConstant.WIDTH_200,
                Name = "UserName",
                CustomCellType = ExcelCellType.Integer,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "UserName" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "CustId",
                Width = HeaderColumnConstant.WIDTH_100,
                Name = "CustId",
                CustomCellType = ExcelCellType.Integer,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "CustId" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Bet Count",
                Width = HeaderColumnConstant.WIDTH_100,
                Name = "BetCount",
                CustomCellType = ExcelCellType.Integer,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "BetCount" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.CURRENCY_TEXT,
                Width = HeaderColumnConstant.WIDTH_100,
                Name = HeaderColumnConstant.CURRENCY_TEXT,
                Sort = true,
                SortDirection = queryModel.SortColumnName == HeaderColumnConstant.CURRENCY_TEXT
                    ? queryModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Total Bets",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "TotalBets",
                CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "TotalBets" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Game Income",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "GameIncome",
                CustomCellType = queryModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "GameIncome" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Game Payout",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "GamePayout",
                CustomCellType = ExcelCellType.Percentage,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "GamePayout" ? queryModel.SortDirection : string.Empty
            },


            new HeaderColumns
            {
                HeaderText = "Real Turnover",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "RealTurnover",
                CustomCellType = queryModel.ViewByInteger ? ExcelCellType.Integer : ExcelCellType.Double,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "RealTurnover" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Gross Income",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseGrossIncome",
                CustomCellType = queryModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseGrossIncome"
                    ? queryModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Comm",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseComm",
                CustomCellType = queryModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseComm" ? queryModel.SortDirection : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = HeaderColumnConstant.EXTRAPT_TEXT,
                Width = HeaderColumnConstant.WIDTH_120,
                Name = HeaderColumnConstant.EXTRAPT_TEXT,
                CustomCellType = queryModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == HeaderColumnConstant.EXTRAPT_TEXT
                    ? queryModel.SortDirection
                    : string.Empty
            },

            new HeaderColumns
            {
                HeaderText = "Net Income",
                Width = HeaderColumnConstant.WIDTH_120,
                Name = "HouseNetIncome",
                CustomCellType = queryModel.ViewByInteger
                    ? ExcelCellType.IntegerRedNegative
                    : ExcelCellType.DoubleRedNegative,
                Sort = true,
                SortDirection = queryModel.SortColumnName == "HouseNetIncome" ? queryModel.SortDirection : string.Empty
            }
        ];
    }

    private static List<Columns> InitColumns(BasicModel statistic, bool viewByInteger, decimal gamePayout)
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
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Percentage
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
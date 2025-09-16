using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface GridOptionDataRowBuilderService
{
    GridDataRow BuildBaseDataRow(BaseRawStatisticModel statistic, bool isGrandTotal);
}

public class GridOptionDataRowBuilderServiceImp : GridOptionDataRowBuilderService
{
    public GridDataRow BuildBaseDataRow(BaseRawStatisticModel statistic, bool isGrandTotal)
    {
        var columns = new List<Columns>
        {
            new()
            {
                Name = "ReportBy", Value = statistic.ReportBy,
                CellAlignment = isGrandTotal ? HAlignment.Right : HAlignment.Left
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
                Name = "Currency", Value = statistic.Currency,
                CellAlignment = HAlignment.Center, CustomAttributes = statistic.CurrencyId.ToString()
            },
            new()
            {
                Name = "TotalBets", Value = Math.Round(statistic.TotalBets, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Double
            },
            new()
            {
                Name = "TotalWins", Value = Math.Round(statistic.TotalWins, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Double
            },
            new()
            {
                Name = "GameIncome", Value = Math.Round(statistic.GameIncome, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.DoubleRedNegative
            },
            new()
            {
                Name = "GamePayout", Value = statistic.GamePayout/100,
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Percentage
            },
            new()
            {
                Name = "HouseTurnover", Value = Math.Round(statistic.HouseTurnover, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.Double
            },
            new()
            {
                Name = "HouseGrossIncome", Value = Math.Round(statistic.HouseGrossIncome, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.DoubleRedNegative
            },
            new()
            {
                Name = "HouseComm", Value = Math.Round(statistic.HouseComm, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.DoubleRedNegative
            },
            new()
            {
                Name = "ExtraPT", Value = Math.Round(statistic.ExtraPT, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.DoubleRedNegative
            },
            new()
            {
                Name = "HouseNetIncome", Value = Math.Round(statistic.HouseNetIncome, 2, MidpointRounding.AwayFromZero),
                CellAlignment = HAlignment.Right, CustomCellType = ExcelCellType.DoubleRedNegative
            }
        };

        return new GridDataRow
        {
            Columns = columns,
            CustomAttr = JsonConvert.SerializeObject(new { statistic.ReportBy })
        };
    }
}
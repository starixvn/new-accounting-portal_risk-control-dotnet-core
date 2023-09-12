using System;
using System.Collections.Generic;
using System.Linq;
using Fanex.Excel.Enums;
using Fanex.Excel.Models;

namespace RiskControl.NonSportsGamesStatistics.Common;

public interface GridOptionCustomExcelCellStyleService
{
    void CustomizeGamePayoutColor(List<Columns> columns);
}

public class GridOptionCustomExcelCellStyleServiceImp : GridOptionCustomExcelCellStyleService
{
    public void CustomizeGamePayoutColor(List<Columns> columns)
    {
        var gamePayoutColumn = columns.First(x => x.Name == "GamePayout");
        var value = Convert.ToDouble(gamePayoutColumn.Value);
        if (value > 1)
        {
            gamePayoutColumn.CssClass += " format-positive";
            gamePayoutColumn.CustomCellType = ExcelCellType.PercentageRedPositive;
        }
    }
}
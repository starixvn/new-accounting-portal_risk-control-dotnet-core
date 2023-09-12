using System.Collections.Generic;
using System.Linq;
using Fanex.Excel.Models;

namespace RiskControl.NonSportsGamesStatistics.Common;

public interface GridOptionRemoveColumnService
{
    GridOptions RemoveColumn(GridOptions gridOptions, List<string> removalColumns);
}

public class GridOptionRemoveColumnServiceImp : GridOptionRemoveColumnService
{
    public GridOptions RemoveColumn(GridOptions gridOptions, List<string> removalColumns)
    {
        if (removalColumns == null)
        {
            return gridOptions;
        }

        RemoveHeaderColumns(gridOptions.Columns, removalColumns);
        RemoveDataRowColumns(gridOptions.BodyRows, removalColumns);
        RemoveDataRowColumns(gridOptions.FooterRows, removalColumns);

        return gridOptions;
    }

    private static void RemoveHeaderColumns(List<HeaderColumns> headerColumns, List<string> removalColumns)
    {
        foreach (var item in removalColumns)
        {
            var column = headerColumns.FirstOrDefault(x => x.Name == item);
            if (column != null)
            {
                headerColumns.Remove(column);
            }
        }
    }

    private static void RemoveDataRowColumns(List<GridDataRow> bodyRows, List<string> removalColumns)
    {
        foreach (var row in bodyRows)
        {
            RemoveRowColumns(row, removalColumns);
            if (row.SubRows.Count > 0)
            {
                foreach (var subRow in row.SubRows)
                {
                    RemoveRowColumns(subRow, removalColumns);
                }
            }
        }
    }

    private static void RemoveRowColumns(GridDataRow bodyRow, List<string> removalColumns)
    {
        foreach (var item in removalColumns)
        {
            var column = bodyRow.Columns.FirstOrDefault(x => x.Name == item);
            if (column != null)
            {
                bodyRow.Columns.Remove(column);
            }
        }
    }
}
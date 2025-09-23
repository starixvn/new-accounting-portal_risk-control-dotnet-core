using Fanex.Excel.Models;

namespace RiskControl.SabaPinGoal.Service;

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
        var removingColumns = removalColumns
            .Select(item => headerColumns.Find(x => x.Name == item))
            .Where(column => column != null);

        foreach (var column in removingColumns)
        {
            headerColumns.Remove(column);
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
        var removingColumns = removalColumns.Select(item => bodyRow.Columns.Find(x => x.Name == item)).Where(column => column != null);
        foreach (var column in removingColumns)
        {
            bodyRow.Columns.Remove(column);
        }
    }
}
using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface DailyGridOptionBuilderService
{
    GridOptions BuildGridOptions(DailyReportModel statistics, QueryModel queryModel);
}

public class DailyGridOptionBuilderServiceImp(GridOptionDataRowBuilderService gridOptionDataRowBuilderService,
    GridOptionHeaderBuilderService headerBuilderService,
    GridOptionRemoveColumnService gridOptionRemoveColumnService) : DailyGridOptionBuilderService
{
    public GridOptions BuildGridOptions(DailyReportModel statistics, QueryModel queryModel)
    {
        statistics.Statistics.ToList().ForEach(item =>
        {
            item.DailyStatistics.ForEach(daily =>
            {
                if (queryModel.IsGrandTotal)
                {
                    daily.ReportBy = $"Total {daily.ReportBy}";
                }
            });
            
        });
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRows(statistics.Statistics),
            FooterRows = BuildFooter(statistics.GrandTotal),
            Columns = headerBuilderService.BuildHeaderColumns(queryModel),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRows(IEnumerable<DailyGroupModel> statistics)
    {
        var dataRows = new List<GridDataRow>();
        var groupDataRows = statistics.Select(BuildDailyGroupDataRow);
        foreach (var groupDataRow in groupDataRows)
        {
            dataRows.AddRange(groupDataRow);
        }

        return dataRows;
    }

    private List<GridDataRow> BuildFooter(BaseRawStatisticModel grandTotal)
    {
        var dataRow = gridOptionDataRowBuilderService.BuildBaseDataRow(grandTotal);
        dataRow.Columns.Insert(0,
            new Columns
            {
                Name = "ReportBy",
                Value = $"Grand Total {grandTotal.Currency}",
                CellAlignment = HAlignment.Right
            });
        return [dataRow];
    }

    public List<GridDataRow> BuildDailyGroupDataRow(DailyGroupModel dailyStatistics)
    {
        var dataRows = new List<GridDataRow>();
        var groupLength = dailyStatistics.DailyStatistics.Count;
        for (var i = 0; i < groupLength; i++)
        {
            var item = dailyStatistics.DailyStatistics[i];
            var dataRow = gridOptionDataRowBuilderService.BuildBaseDataRow(item);
            var groupName = dailyStatistics.GroupName;
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
}
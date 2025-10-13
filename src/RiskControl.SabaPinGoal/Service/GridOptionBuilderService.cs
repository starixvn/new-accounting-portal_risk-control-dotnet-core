using Fanex.Excel.Enums;
using Fanex.Excel.Models;
using Newtonsoft.Json;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface GridOptionBuilderService
{
    GridOptions BuildGridOptions(ReportModel statistics, QueryModel queryModel);

    GridOptions BuildGridOptionsWithGroup(ReportGroupModel statistics, QueryModel queryModel);
}

public class DailyGridOptionBuilderServiceImp(GridOptionDataRowBuilderService gridOptionDataRowBuilderService,
    GridOptionHeaderBuilderService headerBuilderService,
    GridOptionRemoveColumnService gridOptionRemoveColumnService) : GridOptionBuilderService
{
    private const int CustIdColumnIndex = 1;

    public GridOptions BuildGridOptions(ReportModel statistics, QueryModel queryModel)
    {
        statistics.Statistics.ToList().ForEach(item =>
        {
            item.Statistics.ForEach(daily =>
            {
                if (queryModel.IsGrandTotal)
                {
                    daily.ReportBy = $"Total {daily.ReportBy}";
                }
            });
            
        });
        var isReportByUserName = queryModel.ReportBy == ReportByConstant.UserName;
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRows(statistics.Statistics, !isReportByUserName),
            FooterRows = BuildFooter(statistics.GrandTotal, $"Grand Total {statistics.GrandTotal.Currency}", HAlignment.Right, !isReportByUserName),
            Columns = headerBuilderService.BuildHeaderColumns(queryModel, !isReportByUserName),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    public GridOptions BuildGridOptionsWithGroup(ReportGroupModel statistics, QueryModel queryModel)
    {
        var isReportTop20 = queryModel.ReportBy == ReportByConstant.Top20;
        var gridOptions = new GridOptions
        {
            ShowTitle = true,
            TitleType = TitleType.TwoLineBlue,
            TitleInfoText = queryModel.Title,
            BodyRows = BuildBodyRowsWithGroup(statistics.Statistics, isReportTop20),
            FooterRows = isReportTop20 ? [] : BuildFooter(statistics.GrandTotal, $"Grand Total {statistics.GrandTotal.Currency}", HAlignment.Right, !isReportTop20),
            Columns = headerBuilderService.BuildHeaderColumns(queryModel, !isReportTop20),
            ShowFooter = true,
            ShowHighlightRow = false,
            ShowDistinctRow = false,
            ShowTree = true
        };

        gridOptions = gridOptionRemoveColumnService.RemoveColumn(gridOptions, queryModel.RemovalColumns);

        return gridOptions;
    }

    private List<GridDataRow> BuildBodyRowsWithGroup(IEnumerable<ReportModel> statistics, bool isReportTop20)
    {
        var dataRows = new List<GridDataRow>();
        foreach (var group in statistics)
        {
            var customGroupAttributes = new { groupId = group.GrandTotal.ReportById, groupName = isReportTop20 ?
                group.GrandTotal.ReportById : group.GrandTotal.SiteId.ToString() };
            var totalRow = BuildFooter(group.GrandTotal, group.GrandTotal.ReportBy, HAlignment.Left, !isReportTop20).FirstOrDefault() ?? new GridDataRow();
            totalRow.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);
            totalRow.RowType = RowType.ParentLevelOne;
            totalRow.Columns.ForEach(x => x.Bold = true);
            var groupDataRows = BuildBodyRows(group.Statistics, !isReportTop20);
            totalRow.SubRows.AddRange(groupDataRows);

            dataRows.Add(totalRow);
        }

        return dataRows;
    }

    private List<GridDataRow> BuildBodyRows(IEnumerable<GroupModel> statistics, bool isNoOfPlayersColumn)
    {
        var dataRows = new List<GridDataRow>();
        var groupDataRows = statistics.Select(item => BuildGroupDataRow(item, isNoOfPlayersColumn));
        foreach (var groupDataRow in groupDataRows)
        {
            dataRows.AddRange(groupDataRow);
        }

        return dataRows;
    }

    private List<GridDataRow> BuildFooter(BaseRawStatisticModel grandTotal, string totalText, HAlignment alignment, bool isOfPlayersColumn)
    {
        var dataRow = gridOptionDataRowBuilderService.BuildBaseDataRow(grandTotal, isOfPlayersColumn);
        dataRow.Columns.Insert(0,
            new Columns
            {
                Name = "ReportBy",
                Value = totalText,
                CellAlignment = alignment
            });
        if (!isOfPlayersColumn)
        {
            dataRow.Columns[CustIdColumnIndex].Value = string.Empty;
        }
        return [dataRow];
    }

    public List<GridDataRow> BuildGroupDataRow(GroupModel dailyStatistics, bool isOfPlayersColumn)
    {
        var dataRows = new List<GridDataRow>();
        var groupLength = dailyStatistics.Statistics.Count;
        for (var i = 0; i < groupLength; i++)
        {
            var item = dailyStatistics.Statistics[i];
            var dataRow = gridOptionDataRowBuilderService.BuildBaseDataRow(item, isOfPlayersColumn);
            var groupName = dailyStatistics.GroupName;
            var roleId = item.RoleId;
            var currencyId = item.CurrencyId;
            var customGroupAttributes = new { groupName, roleId, currencyId };
            dataRow.CustomAttr = JsonConvert.SerializeObject(customGroupAttributes);

            if (i == 0)
            {
                dataRow.Columns.Insert(0,
                    new Columns
                    {
                        Name = "ReportBy",
                        Value = item.ReportBy,
                        CellAlignment = HAlignment.Left,
                        MergeRowNumber = groupLength
                        
                    });
            }

            dataRows.Add(dataRow);
        }

        return dataRows;
    }
}
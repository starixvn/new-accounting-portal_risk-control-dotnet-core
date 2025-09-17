using RiskControl.SabaPinGoal.Model;
using RiskControl.Sort;

namespace RiskControl.SabaPinGoal.Service;

public interface SortingService
{
    ReportModel SortData(ReportModel reportModel, string sortDirection, string sortColumnName);
}

public class SortingServiceImp : SortingService
{
    public ReportModel SortData(ReportModel reportModel, string sortDirection, string sortColumnName)
    {
        SortStatisticsForPerChildGroup(reportModel, sortDirection, sortColumnName);
        SortStatisticsForParentGroup(reportModel, sortDirection, sortColumnName);
        return reportModel;
    }

    private static void SortStatisticsForPerChildGroup(ReportModel reportModel, string sortDirection, string sortColumnName)
    {
        foreach (var row in reportModel.Statistics)
        {
            SortUtility.SortByProperty(row.Statistics, sortDirection, sortColumnName);
        }
    }

    private static void SortStatisticsForParentGroup(ReportModel reportModel, string sortDirection, string sortColumnName)
    {
        var propInfo = typeof(BaseRawStatisticModel).GetProperty(sortColumnName);
        var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
        reportModel.Statistics = isAsc ?
            reportModel
                .Statistics
                .OrderBy(s => propInfo.GetValue(s.Statistics[0], null))
                .ToList() :
            reportModel
                .Statistics
                .OrderByDescending(s => propInfo.GetValue(s.Statistics[0], null))
                .ToList();
    }
}
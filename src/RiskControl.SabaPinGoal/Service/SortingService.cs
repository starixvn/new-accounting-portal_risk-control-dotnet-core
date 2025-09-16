using RiskControl.SabaPinGoal.Model;
using RiskControl.Sort;

namespace RiskControl.SabaPinGoal.Service;

public interface SortingService
{
    DailyReportModel SortData(DailyReportModel reportModel, string sortDirection, string sortColumnName);
}

public class SortingServiceImp : SortingService
{
    public DailyReportModel SortData(DailyReportModel reportModel, string sortDirection, string sortColumnName)
    {
        SortUtility.SortByProperty(reportModel.Statistics.ToList(), sortDirection, sortColumnName);
        SortStatisticsForParentGroup(reportModel, sortDirection, sortColumnName);
        return reportModel;
    }

    private static void SortStatisticsForParentGroup(DailyReportModel reportModel, string sortDirection, string sortColumnName)
    {
        var propInfo = typeof(BaseRawStatisticModel).GetProperty(sortColumnName);
        var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
        reportModel.Statistics = isAsc ?
            reportModel
                .Statistics
                .OrderBy(s => propInfo.GetValue(s, null))
                .ToList() :
            reportModel
                .Statistics
                .OrderByDescending(s => propInfo.GetValue(s, null))
                .ToList();
    }
}
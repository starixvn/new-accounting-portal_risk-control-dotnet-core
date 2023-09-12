using System;
using System.Linq;
using RiskControl.Core.Sort;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily;

public class SortingServiceImp : SortingService<DailyReportModel>
{
    public DailyReportModel SortData(DailyReportModel reportModel, string sortDirection, string sortColumnName)
    {
        SortStatisticsForPerChildGroup(reportModel, sortDirection, sortColumnName);
        SortStatisticsForParentGroup(reportModel, sortDirection, sortColumnName);
        return reportModel;
    }

    private static void SortStatisticsForPerChildGroup(DailyReportModel reportModel, string sortDirection, string sortColumnName)
    {
        foreach (var row in reportModel.Statistics)
        {
            Sort.SortByProperty(row.DailyStatistics, sortDirection, sortColumnName);
        }
    }

    private static void SortStatisticsForParentGroup(DailyReportModel reportModel, string sortDirection, string sortColumnName)
    {
        var propInfo = typeof(DailyStatisticModel).GetProperty(sortColumnName);
        var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
        reportModel.Statistics = isAsc ?
            reportModel
                .Statistics
                .OrderBy(s => propInfo.GetValue(s.DailyStatistics[0], null))
                .ToList() :
            reportModel
                .Statistics
                .OrderByDescending(s => propInfo.GetValue(s.DailyStatistics[0], null))
                .ToList();
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using RiskControl.Core.Sort;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;

public class SortingServiceImp : SortingService<DailyViewGroupStatisticWithTotalReportModel>
{
    public DailyViewGroupStatisticWithTotalReportModel SortData(DailyViewGroupStatisticWithTotalReportModel reportModel, string sortDirection, string sortColumnName)
    {
        foreach (var group in reportModel.GroupStatisticWithTotal)
        {
            SortStatisticsForPerChildGroup(group.Statistics, sortDirection, sortColumnName);
            SortStatisticsForParentGroup(group, sortDirection, sortColumnName);
        }

        return reportModel;
    }

    private static void SortStatisticsForPerChildGroup(List<DailyViewGroupStatisticsModel> statistics, string sortDirection, string sortColumnName)
    {
        foreach (var item in statistics)
        {
            Sort.SortByProperty(item.DailyViewStatistics, sortDirection, sortColumnName);
        }
    }

    private static void SortStatisticsForParentGroup(DailyViewGroupStatisticsWithTotalModel groupModel, string sortDirection, string sortColumnName)
    {
        var propInfo = typeof(DailyViewStatisticsModel).GetProperty(sortColumnName);
        var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
        groupModel.Statistics = isAsc ?
            groupModel
                .Statistics
                .OrderBy(s => propInfo.GetValue(s.DailyViewStatistics[0], null))
                .ToList() :
            groupModel
                .Statistics
                .OrderByDescending(s => propInfo.GetValue(s.DailyViewStatistics[0], null))
                .ToList();
    }
}
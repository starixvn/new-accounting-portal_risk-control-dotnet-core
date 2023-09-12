using System;
using System.Linq;
using RiskControl.Core.Sort;

namespace RiskControl.VoidRejectRefund.Common;

public interface SortingService<TReportModel> where TReportModel : class
{
    TReportModel SortData(TReportModel reportModel, string sortDirection, string sortColumnName);
}

public class SortingServiceImp : SortingService<StatisticReportModel>
{
    public StatisticReportModel SortData(StatisticReportModel reportModel, string sortDirection, string sortColumnName)
    {
        Sort.SortByProperty(reportModel.Statistics, sortDirection, sortColumnName);
        return reportModel;
    }
}

public class SortingGroupServiceImp : SortingService<GroupStatisticReportModel>
{
    public GroupStatisticReportModel SortData(GroupStatisticReportModel reportModel, string sortDirection, string sortColumnName)
    {
        foreach (var groupStatistics in reportModel.Statistics)
        {
            SortStatisticsForPerChildGroup(groupStatistics, sortDirection, sortColumnName);
            SortStatisticsForParentGroup(groupStatistics, sortDirection, sortColumnName);
        }

        return reportModel;
    }

    private static void SortStatisticsForPerChildGroup(GroupStatisticModel groupModel, string sortDirection, string sortColumnName)
    {
        foreach (var row in groupModel.Statistics)
        {
            Sort.SortByProperty(row.Statistics, sortDirection, sortColumnName);
        }
    }

    private static void SortStatisticsForParentGroup(GroupStatisticModel groupModel, string sortDirection, string sortColumnName)
    {
        var propInfo = typeof(StatisticModel).GetProperty(sortColumnName);
        var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
        groupModel.Statistics = isAsc ?
            groupModel
                .Statistics
                .OrderBy(s => propInfo.GetValue(s.Statistics[0], null))
                .ToList() :
            groupModel
                .Statistics
                .OrderByDescending(s => propInfo.GetValue(s.Statistics[0], null))
                .ToList();
    }
}
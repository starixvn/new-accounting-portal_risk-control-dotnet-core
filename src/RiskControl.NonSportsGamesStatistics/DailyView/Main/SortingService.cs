using System;
using System.Linq;
using RiskControl.CoreNew.Sort;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main
{
    public class SortingServiceImp : SortingService<DailyViewReportModel>
    {
        public DailyViewReportModel SortData(DailyViewReportModel reportModel, string sortDirection, string sortColumnName)
        {
            SortStatisticsForPerChildGroup(reportModel, sortDirection, sortColumnName);
            SortStatisticsForParentGroup(reportModel, sortDirection, sortColumnName);
            return reportModel;
        }

        private static void SortStatisticsForPerChildGroup(DailyViewReportModel reportModel, string sortDirection, string sortColumnName)
        {
            foreach (var row in reportModel.Statistics)
            {
                Sort.SortByProperty(row.DailyViewStatistics, sortDirection, sortColumnName);
            }
        }

        private static void SortStatisticsForParentGroup(DailyViewReportModel reportModel, string sortDirection, string sortColumnName)
        {
            var propInfo = typeof(DailyViewStatisticsModel).GetProperty(sortColumnName);
            var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
            reportModel.Statistics = isAsc ?
            reportModel
                .Statistics
                .OrderBy(s => propInfo.GetValue(s.DailyViewStatistics[0], null))
                .ToList() :
            reportModel
                 .Statistics
                .OrderByDescending(s => propInfo.GetValue(s.DailyViewStatistics[0], null))
                .ToList();
        }
    }
}
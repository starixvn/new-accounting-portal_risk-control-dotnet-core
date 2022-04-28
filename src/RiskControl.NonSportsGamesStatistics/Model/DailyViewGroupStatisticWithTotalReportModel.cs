using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class DailyViewGroupStatisticWithTotalReportModel
    {
        public List<DailyViewGroupStatisticsWithTotalModel> GroupStatisticWithTotal { get; set; } = new List<DailyViewGroupStatisticsWithTotalModel>();

        public DailyViewStatisticsModel GrandTotal { get; set; } = new DailyViewStatisticsModel();
    }
}
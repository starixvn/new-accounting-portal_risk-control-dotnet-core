using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class DailyReportModel
    {
        public List<DailyGroupStatisticsModel> Statistics { get; set; } = new List<DailyGroupStatisticsModel>();

        public DailyViewStatisticsModel GrandTotal { get; set; } = new DailyViewStatisticsModel();
    }
}

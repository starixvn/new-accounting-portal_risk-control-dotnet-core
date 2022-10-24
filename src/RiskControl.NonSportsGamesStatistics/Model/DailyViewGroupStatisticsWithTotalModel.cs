using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class DailyViewGroupStatisticsWithTotalModel
    {
        public DailyViewStatisticsModel Total { get; set; } = new DailyViewStatisticsModel();

        public List<DailyViewGroupStatisticsModel> Statistics { get; set; } = new List<DailyViewGroupStatisticsModel>();
    }
}
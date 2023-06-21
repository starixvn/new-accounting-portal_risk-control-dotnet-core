using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class DailyViewGroupStatisticsWithTotalModel
    {
        public DailyViewStatisticsModel Total { get; set; } = new();

        public List<DailyViewGroupStatisticsModel> Statistics { get; set; } = new();
    }
}
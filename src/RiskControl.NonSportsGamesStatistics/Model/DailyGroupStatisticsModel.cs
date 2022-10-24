using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class DailyGroupStatisticsModel
    {
        public string GroupName { get; set; }

        public List<DailyStatisticModel> DailyStatistics { get; set; } = new List<DailyStatisticModel>();
    }
}

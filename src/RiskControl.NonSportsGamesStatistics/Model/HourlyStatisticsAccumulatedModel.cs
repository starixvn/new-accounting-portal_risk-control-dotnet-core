using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class HourlyStatisticsAccumulatedModel
    {
        public List<HourlyStatistics> HourlyStatistics { get; set; } = new List<HourlyStatistics>();

        public double? AveragePlayer { get; set; }
    }
}
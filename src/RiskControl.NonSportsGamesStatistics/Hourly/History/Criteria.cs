using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History
{
    public class Criteria : BaseStatisticCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool UsernameDrillDown { get; set; }
    }
}
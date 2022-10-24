using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.DeviceHistory
{
    public class Criteria : BaseStatisticCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsDrillDown { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}
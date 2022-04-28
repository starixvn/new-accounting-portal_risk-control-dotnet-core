using System;
using Fanex.Data;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public class BaseHistoryCriteria : BaseStatisticCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(Ignored = true)]
        public int HousePTType { get; set; }

        [SpParam(Ignored = true)]
        public decimal HousePTValue { get; set; }

        public bool IsDrillDown { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}

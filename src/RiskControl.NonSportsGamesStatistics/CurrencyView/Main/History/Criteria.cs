using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Main.History
{
    public class Criteria : BaseStatisticCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int DrillDownCurrency { get; set; }
    }
}
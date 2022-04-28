using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Main.Normal
{
    public class Criteria : BaseStatisticCriteria
    {
        public DateTime WinLostDate { get; set; }

        public int HousePTType { get; set; }

        public decimal HousePTValue { get; set; }

        public int DrillDownCurrency { get; set; }
    }
}
using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.CompanyNormal
{
    public class Criteria : BaseStatisticCriteria
    {
        public DateTime WinLostDate { get; set; }

        public int HousePTType { get; set; }

        public decimal HousePTValue { get; set; }

        public bool IsDrillDown { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}
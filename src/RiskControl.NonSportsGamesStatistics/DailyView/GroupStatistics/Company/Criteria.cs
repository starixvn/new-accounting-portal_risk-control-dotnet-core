using RiskControl.NonSportsGamesStatistics.Common;
using System;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.Company;

public class Criteria : BaseStatisticCriteria
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }
}
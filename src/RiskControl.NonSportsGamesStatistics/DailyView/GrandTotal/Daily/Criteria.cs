using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyGrandTotal;

public class Criteria : BaseStatisticCriteria
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public bool UsernameDrillDown { get; set; }
}
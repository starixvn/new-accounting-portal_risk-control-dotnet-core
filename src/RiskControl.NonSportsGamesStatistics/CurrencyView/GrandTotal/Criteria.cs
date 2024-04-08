using RiskControl.NonSportsGamesStatistics.Common;
using System;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;

public class Criteria: BaseStatisticCriteria
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public int DrillDownCurrency { get; set; }
}
using System;

namespace RiskControl.NonSportsGamesStatistics.Common;

public class BaseNormalCriteria : BaseStatisticCriteria
{
    public DateTime WinLostDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }
}
using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.Normal;

public class Criteria : BaseStatisticCriteria
{
    public DateTime WinLostDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public int RoleId { get; set; }

    public bool IsGrandTotal { get; set; }
}
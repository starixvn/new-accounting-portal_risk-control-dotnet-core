using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main;

public class Criteria : BaseStatisticCriteria
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public int RoleId { get; set; }

    public bool IsGrandTotal { get; set; }
}
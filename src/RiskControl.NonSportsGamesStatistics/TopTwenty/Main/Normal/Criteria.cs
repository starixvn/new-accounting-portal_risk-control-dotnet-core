using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main.Normal;

public class Criteria : BaseStatisticCriteria
{
    public DateTime WinLostDate { get; set; }

    public int HousePTType { get; set; }

    public decimal HousePTValue { get; set; }

    public bool IsDrillDown { get; set; }

    public int TopType { get; set; }

    public int RoleId { get; set; }

    public string SortColumnName { get; set; }
}
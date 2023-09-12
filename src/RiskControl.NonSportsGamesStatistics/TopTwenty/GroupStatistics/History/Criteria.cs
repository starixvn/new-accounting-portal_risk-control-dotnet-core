using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.History;

public class Criteria : BaseStatisticCriteria
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public int TopType { get; set; }

    public int RoleId { get; set; }

    public string SortColumnName { get; set; }
}
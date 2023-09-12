using System;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.Hourly.Normal;

public class Criteria : BaseStatisticCriteria
{
    public DateTime WinLostDate { get; set; }

    public bool UsernameDrillDown { get; set; }
}
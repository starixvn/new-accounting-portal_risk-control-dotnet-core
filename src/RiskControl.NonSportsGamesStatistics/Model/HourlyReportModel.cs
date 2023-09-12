using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model;

public class HourlyReportModel
{
    public HourlyStatisticsAccumulatedModel HourlyStatisticAccumulated { get; set; }

    public List<HourlyStatistics> HourlyStatistics { get; set; }
}
using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model;

public class DailyReportModel
{
    public List<DailyGroupStatisticsModel> Statistics { get; set; } = [];

    public DailyViewStatisticsModel GrandTotal { get; set; } = new();
}
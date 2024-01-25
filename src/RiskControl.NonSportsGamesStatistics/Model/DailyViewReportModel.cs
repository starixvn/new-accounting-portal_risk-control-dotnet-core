using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model;

public class DailyViewReportModel
{
    public List<DailyViewGroupStatisticsModel> Statistics { get; set; } = [];

    public DailyViewStatisticsModel GrandTotal { get; set; } = new();
}
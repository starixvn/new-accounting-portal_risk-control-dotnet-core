using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model;

public class DailyViewGroupStatisticWithTotalReportModel
{
    public List<DailyViewGroupStatisticsWithTotalModel> GroupStatisticWithTotal { get; set; } = [];

    public DailyViewStatisticsModel GrandTotal { get; set; } = new();
}
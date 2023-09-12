using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model;

public class DailyViewGroupStatisticWithTotalReportModel
{
    public List<DailyViewGroupStatisticsWithTotalModel> GroupStatisticWithTotal { get; set; } = new();

    public DailyViewStatisticsModel GrandTotal { get; set; } = new();
}
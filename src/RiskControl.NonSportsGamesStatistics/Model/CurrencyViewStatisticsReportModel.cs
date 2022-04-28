using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class CurrencyViewStatisticsReportModel
    {
        public List<DailyViewStatisticsModel> Statistics { get; set; } = new List<DailyViewStatisticsModel>();

        public DailyViewStatisticsModel GrandTotal { get; set; } = new DailyViewStatisticsModel();
    }
}

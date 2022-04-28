using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class DailyViewGroupStatisticsModel
    {
        public string GroupId { get; set; }

        public string GroupName { get; set; }

        public List<DailyViewStatisticsModel> DailyViewStatistics { get; set; } = new List<DailyViewStatisticsModel>();
    }
}

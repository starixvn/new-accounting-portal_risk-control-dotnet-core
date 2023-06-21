using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class UserNameViewGroupStatisticsWithTotalModel
    {
        public UserNameViewStatisticsModel Total { get; set; } = new();

        public List<UserNameViewGroupStatisticsModel> Statistics { get; set; } = new();
    }
}
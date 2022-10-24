using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class UserNameViewGroupStatisticsWithTotalModel
    {
        public UserNameViewStatisticsModel Total { get; set; } = new UserNameViewStatisticsModel();

        public List<UserNameViewGroupStatisticsModel> Statistics { get; set; } = new List<UserNameViewGroupStatisticsModel>();
    }
}
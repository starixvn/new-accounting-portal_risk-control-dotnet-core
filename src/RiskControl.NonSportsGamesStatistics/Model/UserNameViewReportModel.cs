using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class UserNameViewReportModel
    {
        public List<UserNameViewStatisticsModel> Statistics { get; set; } = new List<UserNameViewStatisticsModel>();

        public UserNameViewStatisticsModel GrandTotal { get; set; } = new UserNameViewStatisticsModel();
    }
}
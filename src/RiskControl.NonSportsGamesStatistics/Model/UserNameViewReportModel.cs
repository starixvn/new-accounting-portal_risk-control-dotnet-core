using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class UserNameViewReportModel
    {
        public List<UserNameViewStatisticsModel> Statistics { get; set; } = new();

        public UserNameViewStatisticsModel GrandTotal { get; set; } = new();
    }
}
using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class UserNameViewGroupStatisticsModel
    {
        public string GroupId { get; set; }

        public string GroupName { get; set; }

        public List<UserNameViewStatisticsModel> UserNameViewStatistics { get; set; } = new();
    }
}
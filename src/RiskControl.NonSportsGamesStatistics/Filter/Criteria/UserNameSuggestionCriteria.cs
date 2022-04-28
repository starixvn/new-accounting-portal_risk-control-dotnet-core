using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Filter.Criteria
{
    public class UsernameSuggestionCriteria : CriteriaBase
    {
        public string UserName { get; set; }

        public int CustId { get; set; }

        public string System { get; set; }

        public bool IsAllowFISearch { get; set; }

        public int RoleId { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => "NonSportsProductStatistics_UserNameSuggestion";
    }
}
using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Filter.Criteria
{
    public class ValidUsernameCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public int RoleId { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => "NonSportsProductStatistics_GetValidUsername";
    }
}
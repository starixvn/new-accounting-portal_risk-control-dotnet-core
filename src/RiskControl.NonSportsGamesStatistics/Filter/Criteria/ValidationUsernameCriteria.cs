using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Filter.Criteria
{
    public class ValidationUsernameCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public override string GetSettingKey() => "Acc_CustomerSelCustByUsername";

        public override bool IsValid() => true;
    }
}

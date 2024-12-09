using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class RuleTitleCriteria : CriteriaBase
{
    public override string GetSettingKey() => "fss_Rule";

    public override bool IsValid() => true;
}
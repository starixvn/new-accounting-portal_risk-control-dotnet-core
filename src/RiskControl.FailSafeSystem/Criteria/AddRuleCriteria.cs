using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class AddRuleCriteria : CriteriaBase, INonQueryCommand
{
    public string RuleTitle { get; set; }

    public string ProductIdList { get; set; }

    public int RuleMemberLimit { get; set; }

    public bool EnableLetstalk { get; set; }

    public string CriteriaList { get; set; }

    public bool IsTest { get; set; }

    public override string GetSettingKey() => "fss_Rule_Add";

    public override bool IsValid() => true;
}
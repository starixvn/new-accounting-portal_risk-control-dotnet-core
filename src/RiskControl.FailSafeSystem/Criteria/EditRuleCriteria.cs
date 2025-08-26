using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class EditRuleCriteria : CriteriaBase, INonQueryCommand
{
    public int ConstantKey { get; set; }

    public string RuleTitle { get; set; }

    public string ProductIdList { get; set; }

    public int RuleMemberLimit { get; set; }

    public bool EnableLetstalk { get; set; }

    public bool EnableAutoDisableProduct { get; set; }

    public string CriteriaList { get; set; }

    public bool IsTest { get; set; }

    public override string GetSettingKey() => "fss_Rule_Edit";

    public override bool IsValid() => true;
}
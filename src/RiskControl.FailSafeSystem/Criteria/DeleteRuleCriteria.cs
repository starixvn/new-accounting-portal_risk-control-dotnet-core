using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class DeleteRuleCriteria: CriteriaBase, INonQueryCommand
{
    public string ConstantKeyList { get; set; }

    public override string GetSettingKey() => "fss_Rule_Delete";

    public override bool IsValid() => true;
}
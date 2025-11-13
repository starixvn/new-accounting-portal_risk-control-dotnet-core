using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class AutoDisableProductInsertCriteria: CriteriaBase, INonQueryCommand
{
    public int UserId { get; set; }

    public string UserName { get; set; }

    public bool IsAutoDisableProduct { get; set; }

    public string Description { get; set; }

    public override string GetSettingKey() => "FailSafeSystemControl_Insert";

    public override bool IsValid() => true;
}
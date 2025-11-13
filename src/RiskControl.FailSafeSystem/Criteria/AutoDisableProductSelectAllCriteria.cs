using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class AutoDisableProductSelectAllCriteria: CriteriaBase
{
    public override string GetSettingKey() => "FailSafeSystemControl_SelectAll";

    public override bool IsValid() => true;
}
using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class AutoDisableProductSelectCurrentCriteria: CriteriaBase
{
    public override string GetSettingKey() => "FailSafeSystemControl_SelectCurrent";

    public override bool IsValid() => true;
}
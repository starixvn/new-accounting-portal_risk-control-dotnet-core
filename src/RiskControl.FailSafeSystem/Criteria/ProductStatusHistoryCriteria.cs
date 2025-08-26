using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class ProductStatusHistoryCriteria : CriteriaBase
{
    public override string GetSettingKey() => "";

    public override bool IsValid() => true;
}
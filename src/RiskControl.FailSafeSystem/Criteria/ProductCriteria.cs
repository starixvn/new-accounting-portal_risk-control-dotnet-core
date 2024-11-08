using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class ProductCriteria : CriteriaBase
{
    public override string GetSettingKey() => "fss_Product";

    public override bool IsValid() => true;
}
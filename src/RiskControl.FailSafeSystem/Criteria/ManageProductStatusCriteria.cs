using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class ManageProductStatusCriteria : CriteriaBase
{
    public string ProductIds { get; set; }

    public override string GetSettingKey() => "fss_ManageProductStatus";

    public override bool IsValid() => true;
}
using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria;

public class ProductStatusHistoryCriteria : CriteriaBase
{
    public int ProductId { get; set; }

    public int SportType { get; set; }

    public override string GetSettingKey() => "fss_ManageProductStatus_ProductHistory";

    public override bool IsValid() => true;
}
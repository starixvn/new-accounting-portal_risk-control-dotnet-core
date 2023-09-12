using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria;

public class GetSiteCriteria : CriteriaBase
{
    public int ProductId { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_SiteByProductSel";

    public override bool IsValid() => true;
}
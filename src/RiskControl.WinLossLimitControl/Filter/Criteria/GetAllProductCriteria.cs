using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetAllProductCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "NAP_WinLimit_AllProductSel";

        public override bool IsValid() => true;
    }
}
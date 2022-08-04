using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetGroupCriteria : CriteriaBase
    {
        public int ProductId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_GroupByProductSel";

        public override bool IsValid() => true;
    }
}

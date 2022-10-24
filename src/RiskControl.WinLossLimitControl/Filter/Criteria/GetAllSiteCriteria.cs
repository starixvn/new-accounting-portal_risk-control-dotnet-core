using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetAllSiteCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "NAP_WinLimit_AllSiteSel";

        public override bool IsValid() => true;
    }
}
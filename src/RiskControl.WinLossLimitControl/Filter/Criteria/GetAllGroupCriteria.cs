using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetAllGroupCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "NAP_WinLimit_AllGroupSel";

        public override bool IsValid() => true;
    }
}
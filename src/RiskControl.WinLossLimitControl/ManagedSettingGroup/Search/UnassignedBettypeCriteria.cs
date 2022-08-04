using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search
{
    public class UnassignedBettypeCriteria : CriteriaBase
    {
        public int ProductID { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_UnassignedBettypeSel";

        public override bool IsValid() => true;
    }
}

using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Groups
{
    public class ReadCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "NAP_WinLimit_AllGameGroupSettingSel";

        public override bool IsValid() => true;
    }
}
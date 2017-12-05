using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Criteria
{
    public class CustomerByIPQueryCriteria : CriteriaBase
    {
        public string IP { get; set; }

        public override string GetSettingKey() => "NAP_Winlimit_UserByIPSel";

        public override bool IsValid() => true;
    }
}
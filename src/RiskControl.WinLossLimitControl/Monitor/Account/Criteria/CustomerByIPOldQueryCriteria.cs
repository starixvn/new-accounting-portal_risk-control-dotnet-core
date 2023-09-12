using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Criteria;

public class CustomerByIPOldQueryCriteria : CriteriaBase
{
    public string IP { get; set; }

    public override string GetSettingKey() => "NAP_Winlimit_UserByIPSel_Old";

    public override bool IsValid() => true;
}
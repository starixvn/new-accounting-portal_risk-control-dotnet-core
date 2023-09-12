using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Criteria;

public class CustomerSiteQueryCriteria : CriteriaBase
{
    public string UsernameList { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustomerSiteSel";

    public override bool IsValid() => true;
}
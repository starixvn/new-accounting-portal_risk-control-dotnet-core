using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock.Criteria;

public class GetCustomerBlockingStatusCriteria : CriteriaBase
{
    public int CustId { get; set; }

    public int ProductId { get; set; }

    public int BetTypeId { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustGameStatusSel";

    public override bool IsValid() => true;
}
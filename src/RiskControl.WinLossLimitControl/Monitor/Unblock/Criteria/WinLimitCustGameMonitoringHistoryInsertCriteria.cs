using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock.Criteria;

public class WinLimitCustGameMonitoringHistoryInsertCriteria : CriteriaBase, INonQueryCommand
{
    public int CustId { get; set; }

    public int ProductId { get; set; }

    public int GroupId { get; set; }

    public int ActionId { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustGameMonitoring_HistoryIns";

    public override bool IsValid() => true;
}
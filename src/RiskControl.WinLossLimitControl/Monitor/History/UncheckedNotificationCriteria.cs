using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.History;

public class UncheckedNotificationCriteria : CriteriaBase, INonQueryCommand
{
    public int CustId { get; set; }

    public int UserID { get; set; }

    public long LogID { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_Notification_History_Update";

    public override bool IsValid() => true;
}
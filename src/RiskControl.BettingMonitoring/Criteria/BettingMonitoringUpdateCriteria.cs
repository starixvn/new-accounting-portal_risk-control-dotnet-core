using Fanex.Data.Repository;

namespace RiskControl.BettingMonitoring.Criteria;

public class BettingMonitoringUpdateCriteria : CriteriaBase, INonQueryCommand
{
    public string MinimumTickets { get; set; }

    public string Threshold { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "NAP_BetMonitoring_SettingUpd";

    public override bool IsValid() => true;
}
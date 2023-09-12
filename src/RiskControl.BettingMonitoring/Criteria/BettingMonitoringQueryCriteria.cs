using Fanex.Data.Repository;

namespace RiskControl.BettingMonitoring.Criteria;

public class BettingMonitoringQueryCriteria : CriteriaBase
{
    public override string GetSettingKey() => "NAP_BetMonitoring_SettingSel";

    public override bool IsValid() => true;
}
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.GameRound.Criteria;

public class ProductGameTypeCriteria : CriteriaBase
{
    public override string GetSettingKey() => "NAP_GameRoundBetLimitMonitorProductGameTypeSel";

    public override bool IsValid() => true;
}
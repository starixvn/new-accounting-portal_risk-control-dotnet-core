using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.GameRound.Criteria;

public class BetLimitSettingQueryCriteria : CriteriaBase
{
    public string ProductId { get; set; }

    public override string GetSettingKey() => "NAP_GameRoundBetLimitSettingSel";

    public override bool IsValid() => true;
}
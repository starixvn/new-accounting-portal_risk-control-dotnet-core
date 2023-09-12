using System;
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.GameRound.Criteria;

public class BetLimitMonitorQueryCriteria : CriteriaBase
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public string ProductId { get; set; }

    public string BetType { get; set; }

    public bool ExcludeTestData { get; set; }

    public override string GetSettingKey() => "NAP_GameRoundBetLimitMonitorSel";

    public override bool IsValid() => true;
}
using System;
using Epplus.Mapper.Annotations;

namespace RiskControl.WinLossLimitControl.GameRound.Model;

public class BetLimitMonitorModel
{
    [Cell("A5")]
    public int Index { get; set; }

    public int ProductId { get; set; }

    [Cell("B5")]
    public string ProductName { get; set; }

    public int SportType { get; set; }

    public int BetType { get; set; }

    [Cell("C5")]
    public string BetTypeName { get; set; }

    [Cell("D5")]
    public string GameRound { get; set; }

    [Cell("E5")]
    public decimal GameRoundBetLimit { get; set; }

    [Cell("F5")]
    public int BetCount { get; set; }

    [Cell("G5")]
    public int NoOfPlayers { get; set; }

    [Cell("H5")]
    public decimal TotalStake { get; set; }

    [Cell("I5")]
    public DateTime ReachedLimitTime { get; set; }
}
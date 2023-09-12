namespace RiskControl.WinLossLimitControl.GameRound.Model;

public class BetLimitSettingModel
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public int SportType { get; set; }

    public int BetType { get; set; }

    public string BetTypeName { get; set; }


    public decimal GameRoundBetLimit { get; set; }
}
namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert;

public class CurrencySetting
{
    public int ProductId { get; set; } = 0;

    public int GroupId { get; set; } = 0;

    public int CurrencyId { get; set; } = 0;

    public int SiteId { get; set; } = 0;

    public int LevelId { get; set; } = 0;

    public decimal MaxWinLimit { get; set; } = 0;

    public bool IsBlockedPlaceBet { get; set; } = false;

    public bool IsBlockedTransfer { get; set; } = false;
}
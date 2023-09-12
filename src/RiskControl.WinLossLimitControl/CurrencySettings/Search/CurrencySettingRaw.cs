using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search;

public class CurrencySettingRaw : WinLossLimitRaw
{
    public int ProductId { get; set; }

    public int GroupId { get; set; }

    public int CurrencyId { get; set; }

    public int SiteId { get; set; }

    public int LevelId { get; set; }

    public decimal MaxWinLimit { get; set; }

    public bool IsBlockedPlaceBet { get; set; }

    public bool IsBlockedTransfer { get; set; }

    public bool IsCreditSite { get; set; }
}
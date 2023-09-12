using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Model;

public class CurrencySetting : WinLossLimit
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public int GroupId { get; set; }

    public string GroupName { get; set; }

    public int CurrencyId { get; set; }

    public string CurrencyName { get; set; }

    public int SiteId { get; set; }

    public string SiteName { get; set; }

    public decimal BlackLimit { get; set; }

    public decimal GreyLimit { get; set; }

    public decimal OrangeLimit { get; set; }

    public decimal YellowLimit { get; set; }

    public decimal RedLimit { get; set; }

    public bool IsBlockedPlacebetRedLevel { get; set; }

    public bool IsBlockedTransferRedLevel { get; set; }

    public bool IsCreditSite { get; set; }
}
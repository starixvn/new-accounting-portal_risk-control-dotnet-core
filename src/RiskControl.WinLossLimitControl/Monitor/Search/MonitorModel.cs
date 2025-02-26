using Epplus.Mapper.Annotations;

namespace RiskControl.WinLossLimitControl.Monitor.Search;

public class MonitorModel
{
    public int CustId { get; set; }

    [Cell("D2")]
    public string UserName { get; set; }

    public int SiteId { get; set; }

    [Cell("E2")]
    public string SiteName { get; set; }

    public int CurrencyId { get; set; }

    [Cell("A2")]
    public string CurrencyName { get; set; }

    public int ProductId { get; set; }

    [Cell("B2")]
    public string ProductName { get; set; }

    public int GroupId { get; set; }

    public string GroupName { get; set; }

    [Cell("H2")]
    public decimal WinningAmount { get; set; }

    [Cell("G2")]
    public decimal WinningAmountRM { get; set; }

    [Cell("F2")]
    public decimal MaxWinLimit_RM { get; set; }

    [Cell("I2")]
    public string ReachedLimitTime { get; set; }

    public int ReachedLimitLevel { get; set; }

    public int NumberReachedLimit { get; set; }

    public bool IsNotified { get; set; }

    public bool IsBlockedPlaceBet { get; set; }

    public bool IsBlockedTransfer { get; set; }

    public bool IsEnableUnblock { get; set; }

    public decimal BlackLimit { get; set; }

    public decimal GreyLimit { get; set; }

    public decimal OrangeLimit { get; set; }

    public decimal YellowLimit { get; set; }

    public decimal RedLimit { get; set; }

    public bool IsSuspendedAccount { get; set; }

    [Cell("C2")]
    public string GameType { get; set; }

    [Cell("J2")]
    public string ReachedLimitLevelText { get; set; }
}
namespace RiskControl.VoidRejectRefund.Common;

public class StatisticModel
{
    public string GroupName { get; set; }

    public string ReportBy { get; set; }

    public int ReportById { get; set; }

    public string Currency { get; set; }

    public int NoOfPlayers { get; set; }

    public int BetCount { get; set; }

    public int Reject { get; set; }

    public int Void { get; set; }

    public int Refund { get; set; }

    public decimal RejectPecentage => BetCount == 0 ? 0 : (decimal)Reject / BetCount;

    public decimal VoidPecentage => BetCount == 0 ? 0 : (decimal)Void / BetCount;

    public decimal RefundPecentage => BetCount == 0 ? 0 : (decimal)Refund / BetCount;
}
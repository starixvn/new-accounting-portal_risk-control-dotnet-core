namespace RiskControl.VoidRejectRefund.Product;

public class ProductLeagueSportBettypeEntity
{
    public string ReportBy { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public int LeagueSportBettypeId { get; set; }

    public string LeagueSportBettypeName { get; set; }

    public int BettypeId { get; set; }

    public string BettypeName { get; set; }

    public int NoOfPlayers { get; set; }

    public int BetCount { get; set; }

    public int Reject { get; set; }

    public int Void { get; set; }

    public int Refund { get; set; }
}
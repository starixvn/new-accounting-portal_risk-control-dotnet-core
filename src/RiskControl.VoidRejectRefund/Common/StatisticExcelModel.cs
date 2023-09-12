using Epplus.Mapper.Annotations;

namespace RiskControl.VoidRejectRefund.Common;

public class StatisticExcelModel
{

    [Cell("A4")]
    public string ReportBy { get; set; }

    [Cell("B4")]
    public int NoOfPlayers { get; set; }

    [Cell("C4")]
    public int BetCount { get; set; }

    [Cell("D4")]
    public int Reject { get; set; }

    [Cell("F4")]
    public int Void { get; set; }

    [Cell("H4")]
    public int Refund { get; set; }

    [Cell("E4")]
    public decimal RejectPecentage { get; set; }

    [Cell("G4")]
    public decimal VoidPecentage { get; set; }

    [Cell("I4")]
    public decimal RefundPecentage { get; set; }
}
using Epplus.Mapper.Annotations;

namespace RiskControl.VoidRejectRefund.Product
{
    public class ProductLeagueSportBettypeStatistic
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
        public decimal RejectPecentage => BetCount == 0 ? 0 : (decimal)Reject / BetCount;

        [Cell("G4")]
        public decimal VoidPecentage => BetCount == 0 ? 0 : (decimal)Void / BetCount;

        [Cell("I4")]
        public decimal RefundPecentage => BetCount == 0 ? 0 : (decimal)Refund / BetCount;
    }
}

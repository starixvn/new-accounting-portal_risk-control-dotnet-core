namespace RiskControl.VoidRejectRefund.Common
{
    public class StatisticEntity
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
    }
}

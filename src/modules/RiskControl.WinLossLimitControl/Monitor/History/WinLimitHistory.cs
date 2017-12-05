namespace RiskControl.WinLossLimitControl.Monitor.History
{
    public class WinLimitHistory
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public string Currency { get; set; }

        public string ModifiedDate { get; set; }

        public decimal BlackLimit { get; set; }

        public decimal GreyLimit { get; set; }

        public decimal OrangeLimit { get; set; }

        public decimal YellowLimit { get; set; }

        public decimal RedLimit { get; set; }

        public decimal WinningAmount { get; set; }

        public decimal WinningAmountRM { get; set; }

        public int ReachedLimitLevel { get; set; }

        public string ActionName { get; set; }

        public string ProceededBy { get; set; }
    }
}
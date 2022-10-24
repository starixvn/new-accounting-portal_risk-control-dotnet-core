namespace RiskControl.WinLossLimitControl.Monitor.Search
{
    public class MonitorModel
    {
        public int CustId { get; set; }

        public string UserName { get; set; }

        public int SiteId { get; set; }

        public string SiteName { get; set; }

        public int CurrencyId { get; set; }

        public string CurrencyName { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public decimal WinningAmount { get; set; }

        public decimal WinningAmountRM { get; set; }

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
    }
}
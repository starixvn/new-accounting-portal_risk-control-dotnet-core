using System;

namespace RiskControl.WinLossLimitControl.Monitor.Search
{
    public class MonitorModelRaw
    {
        public int CustId { get; set; }

        public string UserName { get; set; }

        public int SiteId { get; set; }

        public int CurrencyId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public decimal TotalWinAmount { get; set; }

        public decimal TotalWinAmountRM { get; set; }

        public DateTime ReachedLimitTime { get; set; }

        public bool IsNotified { get; set; }

        public int ReachedLimitLevel { get; set; }

        public int NumberReachedLimit { get; set; }

        public bool IsBlockedPlaceBet { get; set; }

        public bool IsBlockedTransfer { get; set; }

        public bool IsEnableUnblock { get; set; }

        public string MaxWinLimitSetting { get; set; }
    }
}
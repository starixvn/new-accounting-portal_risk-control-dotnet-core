namespace RiskControl.WinLossLimitControl.CurrencySettings.Model
{
    public class UpdateInactiveSiteModel
    {
        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int LevelId { get; set; }

        public int ExchangeID { get; set; }

        public decimal MaxWinLimit { get; set; }

        public bool IsBlockedPlaceBet { get; set; }

        public bool IsBlockedTransfer { get; set; }
    }
}

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    public class CurrencySetting
    {
        public CurrencySetting()
        {
            ProductId = 0;
            GroupId = 0;
            CurrencyId = 0;
            SiteId = 0;
            LevelId = 0;
            MaxWinLimit = 0;
            IsBlockedPlaceBet = false;
            IsBlockedTransfer = false;
        }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int CurrencyId { get; set; }

        public int SiteId { get; set; }

        public int LevelId { get; set; }

        public decimal MaxWinLimit { get; set; }

        public bool IsBlockedPlaceBet { get; set; }

        public bool IsBlockedTransfer { get; set; }
    }
}
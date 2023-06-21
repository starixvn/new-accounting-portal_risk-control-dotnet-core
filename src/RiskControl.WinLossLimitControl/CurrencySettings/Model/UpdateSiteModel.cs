namespace RiskControl.WinLossLimitControl.CurrencySettings.Model
{
    public class UpdateSiteModel
    {
        private const int MostDangerousLevel = 3;

        private bool isBlockedPlaceBet;

        private bool isBlockedTransfer;

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int CurrencyId { get; set; }

        public int SiteId { get; set; }

        public int LevelId { get; set; }

        public decimal MaxWinLimit { get; set; }

        public bool IsBlockedPlaceBet
        {
            get => LevelId == MostDangerousLevel && isBlockedPlaceBet;

            set => isBlockedPlaceBet = value;
        }

        public bool IsBlockedTransfer
        {
            get => LevelId == MostDangerousLevel && isBlockedTransfer;

            set => isBlockedTransfer = value;
        }
    }
}

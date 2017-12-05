namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    public class PlayerSetting
    {
        public int CustId { get; set; }

        public int CurrencyId { get; set; }

        public int SiteId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public decimal BlackLimit { get; set; }

        public decimal GreyLimit { get; set; }

        public decimal OrangeLimit { get; set; }

        public decimal YellowLimit { get; set; }

        public decimal RedLimit { get; set; }
    }
}
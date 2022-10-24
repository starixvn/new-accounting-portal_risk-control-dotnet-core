using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search.Model
{
    public class PlayerSetting : WinLossLimit
    {
        public int CustId { get; set; }

        public string Username { get; set; }

        public int SiteId { get; set; }

        public string SiteName { get; set; }

        public int CurrencyId { get; set; }

        public string CurrencyName { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public decimal BlackLimit { get; set; }

        public decimal GreyLimit { get; set; }

        public decimal OrangeLimit { get; set; }

        public decimal YellowLimit { get; set; }

        public decimal RedLimit { get; set; }

        public bool HasCurrencySetting { get; set; }
    }
}
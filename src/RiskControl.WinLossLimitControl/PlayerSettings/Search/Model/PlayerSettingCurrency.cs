using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search.Model
{
    public class PlayerSettingCurrency
    {
        public string Username { get; set; }

        public string SiteName { get; set; }

        public string CurrencyName { get; set; }

        public List<PlayerSettingProduct> Products { get; set; }
    }
}
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search.Model
{
    public class PlayerSettingRaw : WinLossLimitRaw
    {
        public int CustId { get; set; }

        public string Username { get; set; }

        public int SiteId { get; set; }

        public int CurrencyId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int LevelId { get; set; }

        public decimal MaxWinLimit { get; set; }

        public bool HasCurrencySetting { get; set; }
    }
}
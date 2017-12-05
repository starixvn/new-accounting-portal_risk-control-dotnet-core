using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search
{
    public class SearchCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public int SiteId { get; set; }

        public byte ProductId { get; set; }

        public int CurrencyId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustSettingSel";

        public override bool IsValid() => true;
    }
}
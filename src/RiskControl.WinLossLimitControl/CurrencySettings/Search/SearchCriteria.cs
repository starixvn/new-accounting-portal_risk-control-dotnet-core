using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search
{
    public class SearchCriteria : CriteriaBase
    {
        public int ProductId { get; set; }

        public int SiteId { get; set; }

        public bool IsCreditSite { get; set; }

        public int CurrencyId { get; set; }

        public int GroupId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CurrencySettingSel";

        public override bool IsValid() => true;
    }
}
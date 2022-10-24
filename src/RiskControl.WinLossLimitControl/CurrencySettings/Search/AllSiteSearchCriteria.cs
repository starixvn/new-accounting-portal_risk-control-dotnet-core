using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search
{
    public class AllSiteSearchCriteria : CriteriaBase
    {
        public int ProductId { get; set; }

        public int CurrencyId { get; set; }

        public int GroupId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CurrencySettingAllSiteSel";

        public override bool IsValid() => true;
    }
}
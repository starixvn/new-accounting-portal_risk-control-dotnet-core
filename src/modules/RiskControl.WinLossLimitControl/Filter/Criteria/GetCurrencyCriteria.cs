using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetCurrencyCriteria : CriteriaBase
    {
        public int SiteId { get; set; }

        public bool IsCreditSite { get; set; }

        public bool ExcludeTestCurrency { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CurrencySel";

        public override bool IsValid() => true;
    }
}
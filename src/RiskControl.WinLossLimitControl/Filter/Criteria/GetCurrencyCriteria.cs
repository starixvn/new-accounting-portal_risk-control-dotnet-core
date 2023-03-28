using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetCurrencyCriteria : CriteriaBase
    {
        public string MultiSite { get; set; }

        public byte IsCreditSite { get; set; }

        public bool ExcludeTestCurrency { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CurrencySel";

        public override bool IsValid() => true;
    }
}
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria
{
    public class GetAllCurrencyCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "NAP_WinLimit_AllCurrencySel";

        public override bool IsValid() => true;
    }
}
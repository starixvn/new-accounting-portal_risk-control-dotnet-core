using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Criteria
{
    public class CustomerSiteByCustomerIdQueryCriteria : CriteriaBase
    {
        [SpParam(SqlParamName = "CustIdList")]
        public string CustomerIdList { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustomerSiteByCustIdSel";

        public override bool IsValid() => true;
    }
}
using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Criteria
{
    public class CustomerQueryCriteria : CriteriaBase
    {
        [SpParam(SqlParamName = "CustId")]
        public int CustomerId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustomerInformationSel";

        public override bool IsValid() => true;
    }
}
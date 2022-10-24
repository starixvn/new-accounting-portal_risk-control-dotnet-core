using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.Model
{
    public class CustomerQueryCriteria : CriteriaBase
    {
        [SpParam(SqlParamName = "CustId")]
        public int CustomerId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustomerInformationSel";

        public override bool IsValid() => true;
    }
}
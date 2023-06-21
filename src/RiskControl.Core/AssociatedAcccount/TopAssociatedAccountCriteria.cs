using Fanex.Data.Repository;

namespace RiskControl.Core.AssociatedAcccount
{
    public class TopAssociatedAccountCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public int Type { get; set; }

        public override string GetSettingKey() => "Acc_Rpt_NonSportsStatistics_TopAssociatedAccount_Warehouse";

        public override bool IsValid() => true;
    }
}
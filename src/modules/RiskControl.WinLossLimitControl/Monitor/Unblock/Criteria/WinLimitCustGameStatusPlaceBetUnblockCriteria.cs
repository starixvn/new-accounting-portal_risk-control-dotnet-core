using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock.Criteria
{
    public class WinLimitCustGameStatusPlaceBetUnblockCriteria : CriteriaBase, INonQueryCommand
    {
        public int CustId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int UserId { get; set; }

        public string IP { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustGameStatusPlaceBetUnblock";

        public override bool IsValid() => true;
    }
}
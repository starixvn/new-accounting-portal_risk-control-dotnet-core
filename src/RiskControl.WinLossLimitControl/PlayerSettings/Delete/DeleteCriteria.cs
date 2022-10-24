using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete
{
    public class DeleteCriteria : CriteriaBase, INonQueryCommand
    {
        public int CustId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int UserId { get; set; }

        public string IP { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustSettingDel";

        public override bool IsValid() => true;
    }
}
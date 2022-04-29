using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update
{
    public class ReadCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustSettingSingleSel";

        public override bool IsValid() => true;
    }
}
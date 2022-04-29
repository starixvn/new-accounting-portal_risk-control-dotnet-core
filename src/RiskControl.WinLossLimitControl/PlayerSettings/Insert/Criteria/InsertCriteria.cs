using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert.Criteria
{
    public class InsertCriteria : CriteriaBase, INonQueryCommand
    {
        public int CustId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int CurrencyId { get; set; }

        public int SiteId { get; set; }

        public int LevelId { get; set; }

        public decimal MaxWinLimit { get; set; }

        public int UserId { get; set; }

        public string IP { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CustSettingIns";

        public override bool IsValid() => true;
    }
}
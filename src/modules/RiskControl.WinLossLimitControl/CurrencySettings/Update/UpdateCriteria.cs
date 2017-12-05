using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public class UpdateCriteria : CriteriaBase, INonQueryCommand
    {
        private bool isBlockedPlaceBet;

        private bool isBlockedTransfer;

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int CurrencyId { get; set; }

        public int SiteId { get; set; }

        public int LevelId { get; set; }

        public decimal MaxWinLimit { get; set; }

        public bool IsBlockedPlaceBet
        {
            get
            {
                return LevelId == 3 && isBlockedPlaceBet;
            }

            set
            {
                isBlockedPlaceBet = value;
            }
        }

        public bool IsBlockedTransfer
        {
            get
            {
                return LevelId == 3 && isBlockedTransfer;
            }

            set
            {
                isBlockedTransfer = value;
            }
        }

        public int UserId { get; set; }

        public string IP { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CurrencySettingUpd";

        public override bool IsValid() => true;
    }
}
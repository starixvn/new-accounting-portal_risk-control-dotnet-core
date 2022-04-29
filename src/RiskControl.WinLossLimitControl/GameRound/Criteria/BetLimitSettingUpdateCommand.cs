using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.GameRound.Criteria
{
    public class BetLimitSettingUpdateCommand : NonQueryCommand
    {
        public int UserId { get; set; }

        public string IP { get; set; }

        public int ProductId { get; set; }

        public int SportType { get; set; }

        public int BetType { get; set; }


        public decimal GameRoundBetLimit { get; set; }


        public override string GetSettingKey() => "NAP_GameRoundBetLimitSettingUpd";

        public override bool IsValid() => true;
    }
}
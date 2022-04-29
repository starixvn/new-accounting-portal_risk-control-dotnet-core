using MediatR;

namespace RiskControl.WinLossLimitControl.GameRound.Request
{
    public class BetLimitSettingUpdateRequest : IRequest<string>
    {
        public int ProductId { get; set; }

        public int SportType { get; set; }

        public int BetType { get; set; }

        public decimal GameRoundBetLimit { get; set; }
    }
}

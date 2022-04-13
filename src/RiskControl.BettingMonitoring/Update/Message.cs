using MediatR;

namespace RiskControl.BettingMonitoring.Update
{
    public class Message : IRequest<bool>
    {
        public string MinimumTickets { get; set; }

        public string Threshold { get; set; }
    }
}

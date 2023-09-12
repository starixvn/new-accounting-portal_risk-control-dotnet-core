using MediatR;

namespace RiskControl.BettingMonitoring.Update;

public class Message : IRequest<bool>
{
    public int MinimumTickets { get; set; }

    public int Threshold { get; set; }
}
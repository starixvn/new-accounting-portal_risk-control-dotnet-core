using MediatR;
using RiskControl.BettingMonitoring.Models;

namespace RiskControl.BettingMonitoring.Query
{
    public class Message : IRequest<BettingMonitoringModel>
    {
    }
}

using MediatR;
using RiskControl.BettingMonitoring.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Query;

public class Handler(QueryService queryService) : IRequestHandler<Message, BettingMonitoringModel>
{
    public Task<BettingMonitoringModel> Handle(Message request, CancellationToken cancellationToken)
    {
        return queryService.Execute();
    }
}
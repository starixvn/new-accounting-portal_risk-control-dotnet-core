using MediatR;
using RiskControl.BettingMonitoring.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Query;

public class Handler : IRequestHandler<Message, BettingMonitoringModel>
{
    private readonly QueryService queryService;

    public Handler(QueryService queryService)
    {
        this.queryService = queryService;
    }

    public async Task<BettingMonitoringModel> Handle(Message request, CancellationToken cancellationToken)
    {
        return await queryService.Execute().ConfigureAwait(false);
    }
}
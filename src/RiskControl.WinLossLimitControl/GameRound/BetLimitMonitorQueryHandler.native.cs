using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;

namespace RiskControl.WinLossLimitControl.GameRound;

public class BetLimitMonitorQueryHandler(BetLimitMonitorDataService betLimitMonitorDataService, IMapper mapper)
    : IRequestHandler<BetLimitMonitorQueryRequest, List<BetLimitMonitorModel>>
{
    public async Task<List<BetLimitMonitorModel>> Handle(BetLimitMonitorQueryRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<BetLimitMonitorQueryCriteria>(request);
        return await betLimitMonitorDataService.Query(criteria);
    }
}
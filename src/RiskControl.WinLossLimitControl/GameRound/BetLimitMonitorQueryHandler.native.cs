using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;

namespace RiskControl.WinLossLimitControl.GameRound;

public class BetLimitMonitorQueryHandler : IRequestHandler<BetLimitMonitorQueryRequest, List<BetLimitMonitorModel>>
{
    private readonly BetLimitMonitorDataService betLimitMonitorDataService;

    private readonly IMapper mapper;

    public BetLimitMonitorQueryHandler(BetLimitMonitorDataService betLimitMonitorDataService, IMapper mapper)
    {
        this.betLimitMonitorDataService = betLimitMonitorDataService;
        this.mapper = mapper;
    }

    public async Task<List<BetLimitMonitorModel>> Handle(BetLimitMonitorQueryRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<BetLimitMonitorQueryCriteria>(request);
        return await betLimitMonitorDataService.Query(criteria);
    }
}
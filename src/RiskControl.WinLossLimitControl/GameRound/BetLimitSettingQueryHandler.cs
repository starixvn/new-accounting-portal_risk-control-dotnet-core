using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;

namespace RiskControl.WinLossLimitControl.GameRound;

public class BetLimitSettingQueryHandler(IDynamicRepository dynamicRepository, IMapper mapper) : IRequestHandler<BetLimitSettingQueryRequest, List<BetLimitSettingModel>>
{
    public async Task<List<BetLimitSettingModel>> Handle(BetLimitSettingQueryRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<BetLimitSettingQueryCriteria>(request);

        var models = (await dynamicRepository.FetchAsync<BetLimitSettingModel>(criteria)).ToList();
        return models;
    }
}
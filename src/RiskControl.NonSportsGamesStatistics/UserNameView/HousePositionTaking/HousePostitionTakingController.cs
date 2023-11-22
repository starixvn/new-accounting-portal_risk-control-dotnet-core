using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking;

[ApiController]
[Route("NonSportsGamesStatistics/HousePostitionTaking")]
public class HousePostitionTakingController(IMediator mediator) : ControllerBase
{
    [HttpPost, Route("Query")]
    public async Task<IEnumerable<HousePositionTakingModel>> Query(QueryModel queryModel)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return result;
    }
}
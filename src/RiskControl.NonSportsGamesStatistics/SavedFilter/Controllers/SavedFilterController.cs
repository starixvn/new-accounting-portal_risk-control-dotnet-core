using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Requests;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.SavedFilter.Controllers;

[ApiController]
[Route("NonSportsGamesStatistics/SavedFilter")]
public class SavedFilterController(IMediator mediator): ControllerBase
{
    [Route("Query")]
    public async Task<IActionResult> Query(SavedFilterRequest request) =>
        Ok(await mediator.Send(request).ConfigureAwait(false));

    [Route("Execute")]
    public async Task<IActionResult> Execute(ExecuteFilterRequest request) =>
        Ok(await mediator.Send(request).ConfigureAwait(false));
}
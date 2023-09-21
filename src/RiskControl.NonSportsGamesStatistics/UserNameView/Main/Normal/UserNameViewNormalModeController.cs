using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal;

using Olympus.WebApi.Epplus;

[ApiController]
[Route("NonSportsGamesStatistics/UserNameViewNormal")]
public class UserNameViewNormalModeController : ControllerBase
{
    private readonly IMediator mediator;

    public UserNameViewNormalModeController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost, Route("Query")]
    public async Task<IActionResult> Query(QueryModel queryModel)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return Ok(result);
    }

    [HttpPost, Route("Excel")]
    public async Task<IActionResult> Excel(QueryModelExcel queryModel)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return new EpplusExcelResult(result);
    }
}
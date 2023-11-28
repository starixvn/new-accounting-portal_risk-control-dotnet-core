using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal;

using Results;

[ApiController]
[Route("NonSportsGamesStatistics/UserNameViewNormal")]
public class UserNameViewNormalModeController(IMediator mediator) : ControllerBase
{
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
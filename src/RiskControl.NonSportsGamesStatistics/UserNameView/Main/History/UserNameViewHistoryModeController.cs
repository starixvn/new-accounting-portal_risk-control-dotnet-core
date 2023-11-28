using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.History;

using Attributes;
using Results;

[ApiController]
[Route("NonSportsGamesStatistics/UserNameViewHistory")]
[ValidationActionFilter]
public class UserNameViewHistoryModeController(IMediator mediator) : ControllerBase
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
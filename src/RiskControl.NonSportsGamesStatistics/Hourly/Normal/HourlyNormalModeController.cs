using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Hourly.Normal;

using Results;

[ApiController]
[Route("NonSportsGamesStatistics/HourlyNormal")]
public class HourlyNormalModeController(IMediator mediator) : ControllerBase
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
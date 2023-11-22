using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History;

using Attributes;
using Results;

[ApiController]
[Route("NonSportsGamesStatistics/HourlyHistory")]
[ValidationActionFilter]
public class HourlyHistoryModeController(IMediator mediator) : ControllerBase
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
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Hourly;

using Attributes;
using Results;

[ApiController]
[Route("NonSportsGamesStatistics/Hourly")]
[ValidationActionFilter]
public class HourlyController(IMediator mediator) : ControllerBase
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
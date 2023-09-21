using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Hourly.Normal;

using Olympus.WebApi.Epplus;

[ApiController]
[Route("NonSportsGamesStatistics/HourlyNormal")]
public class HourlyNormalModeController : ControllerBase
{
    private readonly IMediator mediator;

    public HourlyNormalModeController(IMediator mediator)
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
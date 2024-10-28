using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Attributes;
using RiskControl.NonSportsGamesStatistics.Constants;
using RiskControl.Results;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline.SMA;

[ApiController]
[Route("HeadlineNonSportsGamesStatistics/SMA")]
[ValidationActionFilter]
public class Controller(IMediator mediator) : ControllerBase
{
    [HttpPost, Route("Query")]
    public async Task<IActionResult> Query(Request queryModel)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return Ok(result);
    }

    [HttpPost, Route("Excel")]
    public async Task<IActionResult> Excel(Request queryModel)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return new FanexExcelResult(result, SheetNameConstant.SHEETNAME);
    }
}
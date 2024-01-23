using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.NonSportsGamesStatistics.Common;

using Results;

[ApiController]
public class BaseController<TQueryModel>(IMediator mediator) : ControllerBase
    where TQueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
{
    public virtual async Task<IActionResult> Query(TQueryModel queryModel)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return Ok(result);
    }

    public virtual async Task<IActionResult> Excel(TQueryModel queryModel, string sheetName)
    {
        var result = await mediator.Send(queryModel).ConfigureAwait(false);
        return new FanexExcelResult(result, sheetName);
    }
}
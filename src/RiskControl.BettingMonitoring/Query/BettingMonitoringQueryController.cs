using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Query;

[ApiController]
[Route("api/betting-monitoring")]
public class BettingMonitoringQueryController(IMediator mediator) : ControllerBase
{
    [Route("query")]
    public async Task<IActionResult> Query(Message message)
    {
        var result = await mediator.Send(message).ConfigureAwait(false);

        return Ok(result);
    }
}
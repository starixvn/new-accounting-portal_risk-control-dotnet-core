using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Query
{
    [Route("api/betting-monitoring")]
    public class BettingMonitoringQueryController : ControllerBase
    {
        private readonly IMediator mediator;

        public BettingMonitoringQueryController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("query")]
        public async Task<IActionResult> Query(Message message)
        {
            var result = await mediator.Send(message).ConfigureAwait(false);

            return Ok(result);
        }
    }
}

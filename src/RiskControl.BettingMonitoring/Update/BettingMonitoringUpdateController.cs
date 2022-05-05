using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Update
{
    [Route("state-api/betting-monitoring")]
    public class BettingMonitoringUpdateController : ControllerBase
    {
        private readonly IMediator mediator;

        public BettingMonitoringUpdateController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("update")]
        [NapAuth(FunctionKey = FunctionKeys.BetSettingMonitoring, Policy = Constant.Policy.Host)]
        public async Task<IActionResult> Update(Message message)
        {
            var result = await mediator.Send(message).ConfigureAwait(false);

            return Ok(result);
        }
    }
}

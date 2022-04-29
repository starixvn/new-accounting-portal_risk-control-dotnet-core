using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.History
{
    [Route("state-api/win-limit-control/monitor")]
    public class UncheckedNotificationController : ControllerBase
    {
        private readonly IMediator mediator;

        public UncheckedNotificationController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Host)]
        [Route("uncheck-notification")]
        [HttpPost]
        public async Task<IActionResult> UncheckNotification(RequestUncheckedNotification parameter)
        {
            var viewModel = await mediator.Send(parameter);
            return Ok(viewModel);
        }
    }
}

using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    [Route("api/win-limit-control/monitor")]
    public class MonitorAccountController : ControllerBase
    {
        private readonly IMediator mediator;

        public MonitorAccountController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("account")]
        [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Read)]
        [HttpPost]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}
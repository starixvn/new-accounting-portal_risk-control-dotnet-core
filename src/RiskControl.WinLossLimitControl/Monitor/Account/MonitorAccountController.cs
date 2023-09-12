using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    using Fanex.NAP.Client.Attributes;
    using Fanex.NAP.Client.Helpers.Business;

    [ApiController]
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
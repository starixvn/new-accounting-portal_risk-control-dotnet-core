using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Configurations;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    [Route("api/win-limit-control/monitor")]
    public class MonitorAccountController : Controller
    {
        private readonly IMediator mediator;

        public MonitorAccountController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("account")]
        [Function(FunctionKeys.WinLimitMonitor, Policy.Read)]
        [HttpPost]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
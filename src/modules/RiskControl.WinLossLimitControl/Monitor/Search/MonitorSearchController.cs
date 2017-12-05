using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RiskControl.WinLossLimitControl.Constants;
using Olympus.DotNetCore.Authentication;

namespace RiskControl.WinLossLimitControl.Monitor.Search
{
    [Route("api/win-limit-control/monitor")]
    public class MonitorSearchController : Controller
    {
        private readonly IMediator mediator;

        public MonitorSearchController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Function(FunctionKeys.WinLimitMonitor, Policy.Read)]
        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Post(Request parameter)
        {
            var viewModel = await mediator.Send(parameter).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
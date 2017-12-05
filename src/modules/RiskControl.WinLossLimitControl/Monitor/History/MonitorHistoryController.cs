using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Constants;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.History
{
    [Route("api/win-limit-control/monitor")]
    public class MonitorHistoryController : Controller
    {
        private readonly IMediator mediator;

        public MonitorHistoryController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Function(FunctionKeys.CurrencyWinLimitSetting, Policy.Read)]
        [Route("history")]
        [HttpPost]
        public async Task<IActionResult> Post(Request parameter)
        {
            var viewModel = await mediator.Send(parameter).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Configurations;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock
{
    [Route("state-api/win-limit-control/monitor")]
    public class UnblockMemberController : Controller
    {
        private readonly IMediator mediator;

        public UnblockMemberController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("unblock-transfer")]
        [HttpPost]
        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Write)]
        public async Task<IActionResult> UnblockTransfer(RequestUnblockTransfer request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }

        [Route("unblock-place-bet")]
        [HttpPost]
        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Write)]
        public async Task<IActionResult> UnblockPlaceBet(RequestUnblockPlaceBet request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
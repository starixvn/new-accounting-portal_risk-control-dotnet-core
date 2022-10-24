using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock
{
    [ApiController]
    [Route("state-api/win-limit-control/monitor")]
    public class UnblockMemberController : ControllerBase
    {
        private readonly IMediator mediator;

        public UnblockMemberController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("unblock-transfer")]
        [HttpPost]
        [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Host)]
        public async Task<IActionResult> UnblockTransfer(RequestUnblockTransfer request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [Route("unblock-place-bet")]
        [HttpPost]
        [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Host)]
        public async Task<IActionResult> UnblockPlaceBet(RequestUnblockPlaceBet request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}
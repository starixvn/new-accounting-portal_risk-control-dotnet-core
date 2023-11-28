using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("state-api/win-limit-control/monitor")]
public class UnblockMemberController(IMediator mediator) : ControllerBase
{
    [Route("unblock-transfer")]
    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> UnblockTransfer(RequestUnblockTransfer request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }

    [Route("unblock-place-bet")]
    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Host)]
    public async Task<IActionResult> UnblockPlaceBet(RequestUnblockPlaceBet request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
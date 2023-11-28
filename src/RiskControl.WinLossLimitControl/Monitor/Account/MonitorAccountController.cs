using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/win-limit-control/monitor")]
public class MonitorAccountController(IMediator mediator) : ControllerBase
{
    [Route("account")]
    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Read)]
    [HttpPost]
    public async Task<IActionResult> Post(Request request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
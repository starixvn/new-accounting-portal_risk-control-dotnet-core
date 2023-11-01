using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.Monitor.History;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/win-limit-control/monitor")]
public class MonitorHistoryController : ControllerBase
{
    private readonly IMediator mediator;

    public MonitorHistoryController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Read)]
    [Route("history")]
    [HttpPost]
    public async Task<IActionResult> Post(Request parameter)
    {
        var viewModel = await mediator.Send(parameter);
        return Ok(viewModel);
    }
}
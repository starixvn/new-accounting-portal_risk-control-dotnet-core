using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.History;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("state-api/win-limit-control/monitor")]
public class UncheckedNotificationController : ControllerBase
{
    private readonly IMediator mediator;

    public UncheckedNotificationController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Host)]
    [Route("uncheck-notification")]
    [HttpPost]
    public async Task<IActionResult> UncheckNotification(RequestUncheckedNotification parameter)
    {
        var viewModel = await mediator.Send(parameter);
        return Ok(viewModel);
    }
}
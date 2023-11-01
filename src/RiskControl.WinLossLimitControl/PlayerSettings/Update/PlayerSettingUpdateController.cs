using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("state-api/win-limit-control/player-setting")]
public class PlayerSettingUpdateController : ControllerBase
{
    private readonly IMediator mediator;

    public PlayerSettingUpdateController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Host)]
    [Route("Update")]
    public async Task<IActionResult> Post(Request request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
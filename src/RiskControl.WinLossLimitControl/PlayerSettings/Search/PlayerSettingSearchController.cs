using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/win-limit-control/player-setting")]
public class PlayerSettingSearchController : ControllerBase
{
    private readonly IMediator mediator;

    public PlayerSettingSearchController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Read)]
    [Route("search")]
    [HttpPost]
    public async Task<IActionResult> Post(Request request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/win-limit-control/player-setting")]
public class PlayerSettingSearchForInsertingController(IMediator mediator) : ControllerBase
{
    [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Read)]
    [HttpPost]
    [Route("search-for-inserting")]
    public async Task<IActionResult> Post(RequestSearch request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }

    [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Read)]
    [HttpPost]
    [Route("validate")]
    [Route("validate-for-inserting")]
    public async Task<IActionResult> Post(RequestValidation request)
    {
        var validateResult = await mediator.Send(request);
        return Ok(validateResult);
    }
}
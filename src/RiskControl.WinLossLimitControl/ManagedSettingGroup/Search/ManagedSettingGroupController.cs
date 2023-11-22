using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/win-limit-control/manage-setting-group")]
public class ManagedSettingGroupController(IMediator mediator) : ControllerBase
{
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
    [Route("representative-bettype")]
    [HttpPost]
    public async Task<IActionResult> Post(RepresentativeBettypeRequest request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }

    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
    [Route("unassigned-bettype")]
    [HttpPost]
    public async Task<IActionResult> Post(UnassignedBettypeRequest request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }

    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
    [Route("group-setting")]
    [HttpPost]
    public async Task<IActionResult> Post(GroupSettingRequest request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
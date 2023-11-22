using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("state-api/win-limit-control/manage-setting-group")]
public class ManagedSettingGroupUpdateController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Host)]
    [Route("initialize-settings")]
    public async Task<IActionResult> Post(GameGroupSettingRequest request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
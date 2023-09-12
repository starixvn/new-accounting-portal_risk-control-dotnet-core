using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("state-api/win-limit-control/manage-setting-group")]
public class ManagedSettingGroupUpdateController : ControllerBase
{
    private readonly IMediator mediator;

    public ManagedSettingGroupUpdateController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Host)]
    [Route("initialize-settings")]
    public async Task<IActionResult> Post(GameGroupSettingRequest request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
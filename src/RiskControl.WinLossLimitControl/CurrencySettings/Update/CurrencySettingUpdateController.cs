using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("state-api/win-limit-control/currency-setting")]
public class CurrencySettingUpdateController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Host)]
    [Route("update")]
    public async Task<IActionResult> Post(Request request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }

    [HttpPost]
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Host)]
    [Route("update-inactive-site")]
    public async Task<IActionResult> Post(UpdateInactiveSiteRequest request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
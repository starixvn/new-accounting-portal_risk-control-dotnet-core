using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;

[ApiController]
[Route("api/win-limit-control/currency-setting")]
public class CurrencySettingSearchController(IMediator mediator) : ControllerBase
{
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
    [Route("search")]
    [HttpPost]
    public async Task<IActionResult> Post(Request request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
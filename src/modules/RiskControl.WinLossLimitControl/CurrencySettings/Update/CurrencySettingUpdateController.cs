using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Configurations;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    [Route("state-api/win-limit-control/currency-setting")]
    public class CurrencySettingUpdateController : Controller
    {
        private readonly IMediator mediator;

        public CurrencySettingUpdateController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Function(FunctionKeys.CurrencyWinLimitSetting, Policy.Write)]
        [Route("update")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Constants;
using System.Threading.Tasks;
namespace RiskControl.WinLossLimitControl.CurrencySettings.Search
{
    [Route("api/win-limit-control/currency-setting")]
    public class CurrencySettingSearchController : Controller
    {
        private readonly IMediator mediator;

        public CurrencySettingSearchController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Function(FunctionKeys.CurrencyWinLimitSetting, Policy.Read)]
        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
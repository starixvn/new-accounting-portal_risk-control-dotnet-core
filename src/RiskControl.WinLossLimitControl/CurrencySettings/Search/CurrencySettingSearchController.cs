using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search
{
    using Fanex.NAP.Client.Attributes;
    using Fanex.NAP.Client.Helpers.Business;

    [ApiController]
    [Route("api/win-limit-control/currency-setting")]
    public class CurrencySettingSearchController : ControllerBase
    {
        private readonly IMediator mediator;

        public CurrencySettingSearchController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}
using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    [Route("state-api/win-limit-control/currency-setting")]
    public class CurrencySettingUpdateController : ControllerBase
    {
        private readonly IMediator mediator;

        public CurrencySettingUpdateController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Host)]
        [Route("update")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}
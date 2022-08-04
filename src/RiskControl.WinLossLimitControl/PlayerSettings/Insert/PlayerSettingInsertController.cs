using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    [ApiController]
    [Route("state-api/win-limit-control/player-setting")]
    public class PlayerSettingInsertController : ControllerBase
    {
        private readonly IMediator mediator;

        public PlayerSettingInsertController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Host)]
        [Route("insert")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}
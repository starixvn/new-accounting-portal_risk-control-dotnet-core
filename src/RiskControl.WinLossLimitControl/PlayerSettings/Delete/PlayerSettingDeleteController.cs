using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete
{
    [ApiController]
    [Route("state-api/win-limit-control/player-setting")]
    public class PlayerSettingDeleteController : ControllerBase
    {
        private readonly IMediator mediator;

        public PlayerSettingDeleteController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Host)]
        [Route("delete")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using System.Threading.Tasks;
using RiskControl.WinLossLimitControl.Constants;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update
{
    [Route("state-api/win-limit-control/player-setting")]
    public class PlayerSettingUpdateController : Controller
    {
        private readonly IMediator mediator;

        public PlayerSettingUpdateController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Write)]
        [Route("Update")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
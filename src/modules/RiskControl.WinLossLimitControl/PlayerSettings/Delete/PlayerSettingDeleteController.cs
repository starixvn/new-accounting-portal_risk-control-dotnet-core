using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Constants;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete
{
    [Route("state-api/win-limit-control/player-setting")]
    public class PlayerSettingDeleteController : Controller
    {
        private readonly IMediator mediator;

        public PlayerSettingDeleteController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Write)]
        [Route("delete")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
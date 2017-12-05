using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Constants;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    [Route("state-api/win-limit-control/player-setting")]
    public class PlayerSettingInsertController : Controller
    {
        private readonly IMediator mediator;

        public PlayerSettingInsertController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Write)]
        [Route("insert")]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
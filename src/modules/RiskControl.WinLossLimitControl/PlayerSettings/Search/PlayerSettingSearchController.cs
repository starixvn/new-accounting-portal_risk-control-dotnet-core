using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Constants;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search
{
    [Route("api/win-limit-control/player-setting")]
    public class PlayerSettingSearchController : Controller
    {
        private readonly IMediator mediator;

        public PlayerSettingSearchController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Read)]
        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Post(Request request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }
    }
}
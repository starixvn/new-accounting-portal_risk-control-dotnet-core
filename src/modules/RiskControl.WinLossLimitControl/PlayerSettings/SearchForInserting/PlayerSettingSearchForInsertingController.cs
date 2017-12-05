
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Constants;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting
{
    [Route("api/win-limit-control/player-setting")]
    public class PlayerSettingSearchForInsertingController : Controller
    {
        private readonly IMediator mediator;

        public PlayerSettingSearchForInsertingController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Read)]
        [HttpPost]
        [Route("search-for-inserting")]
        public async Task<IActionResult> Post(RequestSearch request)
        {
            var viewModel = await mediator.Send(request).ConfigureAwait(false);
            return Json(viewModel);
        }

        [Function(FunctionKeys.PlayerWinLimitManagement, Policy.Read)]
        [HttpPost]
        [Route("validate")]
        [Route("validate-for-inserting")]
        public async Task<IActionResult> Post(RequestValidation request)
        {
            var validateResult = await mediator.Send(request).ConfigureAwait(false);
            return Json(validateResult);
        }
    }
}
using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting
{
    [Route("api/win-limit-control/player-setting")]
    public class PlayerSettingSearchForInsertingController : ControllerBase
    {
        private readonly IMediator mediator;

        public PlayerSettingSearchForInsertingController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Read)]
        [HttpPost]
        [Route("search-for-inserting")]
        public async Task<IActionResult> Post(RequestSearch request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Read)]
        [HttpPost]
        [Route("validate")]
        [Route("validate-for-inserting")]
        public async Task<IActionResult> Post(RequestValidation request)
        {
            var validateResult = await mediator.Send(request);
            return Ok(validateResult);
        }
    }
}
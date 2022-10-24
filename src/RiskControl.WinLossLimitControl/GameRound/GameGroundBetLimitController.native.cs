using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Results;
using RiskControl.Core.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;
using RiskControl.WinLossLimitControl.Services;
using System.Threading.Tasks;
namespace RiskControl.WinLossLimitControl.GameRound
{
    [ApiController]
    public class GameRoundBetLimitController : ControllerBase
    {
        private readonly IMediator mediator;

        private readonly AuthorizationService authorizationService;

        public GameRoundBetLimitController(IMediator mediator, AuthorizationService authorizationService)
        {
            this.mediator = mediator;
            this.authorizationService = authorizationService;
        }

        [Route("api/game-ground-bet-limit/setting-query")]
        public async Task<IActionResult> SettingQueryAsync(BetLimitSettingQueryRequest request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [Route("state-api/game-ground-bet-limit/setting-update")]
        public async Task<IActionResult> SettingUpdateAsync(BetLimitSettingUpdateRequest request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [Route("api/game-ground-bet-limit/monitor")]
        public async Task<IActionResult> MonitorAsync(BetLimitMonitorQueryRequest request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [Route("api/game-ground-bet-limit/monitor-excel")]
        public async Task<IActionResult> MonitorExcelAsync(BetLimitMonitorQueryExcelRequest request)
        {
            var viewModel = await mediator.Send(request);
            return new EpplusExcelResult(viewModel);
        }

        [Route("state-api/game-ground-bet-limit/host-permission")]
        [HttpPost]
        public IActionResult HasHostPermission()
        {
            var hasHostPermission = authorizationService.HasPermission(FunctionKeys.GameRoundBetLimitSetting, Constant.Policy.Host);
            return Ok(hasHostPermission);
        }

        [Route("api/game-ground-bet-limit/product-game-type")]
        [HttpGet]
        public async Task<IActionResult> ProductGameType()
        {
            var viewModel = await mediator.Send(new ProductGameTypeRequest());
            return Ok(viewModel);
        }
    }
}
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search
{
    [ApiController]
    [Route("api/win-limit-control/manage-setting-group")]
    public class ManagedSettingGroupController : ControllerBase
    {
        private readonly IMediator mediator;

        public ManagedSettingGroupController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
        [Route("representative-bettype")]
        [HttpPost]
        public async Task<IActionResult> Post(RepresentativeBettypeRequest request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
        [Route("unassigned-bettype")]
        [HttpPost]
        public async Task<IActionResult> Post(UnassignedBettypeRequest request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }

        [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
        [Route("group-setting")]
        [HttpPost]
        public async Task<IActionResult> Post(GroupSettingRequest request)
        {
            var viewModel = await mediator.Send(request);
            return Ok(viewModel);
        }
    }
}

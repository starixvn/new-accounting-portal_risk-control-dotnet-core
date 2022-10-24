using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Groups
{
    [Route("api/win-limit-control/group-settings")]
    public class GroupSettingController : ControllerBase
    {
        private readonly IMediator mediator;

        public GroupSettingController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> Post()
        {
            var viewModel = await mediator.Send(new Request());
            return Ok(viewModel);
        }
    }
}
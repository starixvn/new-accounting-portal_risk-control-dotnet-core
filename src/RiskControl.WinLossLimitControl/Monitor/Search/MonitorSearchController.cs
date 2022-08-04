using System.Threading.Tasks;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Search
{
    [ApiController]
    [Route("api/win-limit-control/monitor")]
    public class MonitorSearchController : ControllerBase
    {
        private readonly IMediator mediator;

        public MonitorSearchController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Read)]
        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Post(Request parameter)
        {
            var viewModel = await mediator.Send(parameter);
            return Ok(viewModel);
        }
    }
}
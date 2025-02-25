using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.Search;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using RiskControl.Results;

[ApiController]
[Route("api/win-limit-control/monitor")]
public class MonitorSearchController(IMediator mediator) : ControllerBase
{
    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Read)]
    [Route("search")]
    [HttpPost]
    public async Task<IActionResult> Post(Request parameter)
    {
        var viewModel = await mediator.Send(parameter);
        return Ok(viewModel);
    }

    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(ExcelRequest request)
    {
        var viewModel = await mediator.Send(request);
        return new EpplusExcelResult(viewModel);
    }
}
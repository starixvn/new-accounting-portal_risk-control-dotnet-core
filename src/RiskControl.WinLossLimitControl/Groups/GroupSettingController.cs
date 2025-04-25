using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Groups;

[Route("api/win-limit-control/group-settings")]
[ApiController]
public class GroupSettingController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [Route("")]
    public async Task<IActionResult> Post(Request request)
    {
        var viewModel = await mediator.Send(request);
        return Ok(viewModel);
    }
}
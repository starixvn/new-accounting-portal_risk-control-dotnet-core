using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Results;
using RiskControl.VoidRejectRefund.Common;
using System.Threading.Tasks;

namespace RiskControl.VoidRejectRefund.Daily;

[ApiController]
[Route("api/void-reject-refund/daily")]
public class DailyModeController : ControllerBase
{
    private readonly IMediator mediator;

    public DailyModeController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [Route("")]
    public async Task<IActionResult> Index(HttpParameterJson httpParameter)
    {
        var viewModel = await mediator.Send(httpParameter).ConfigureAwait(false);
        return Ok(viewModel);
    }

    [Route("excel")]
    public async Task<IActionResult> Excel(HttpParameterExcel httpParameter)
    {
        var excelPackage = await mediator.Send(httpParameter).ConfigureAwait(false);
        return new EpplusExcelResult(excelPackage);
    }
}
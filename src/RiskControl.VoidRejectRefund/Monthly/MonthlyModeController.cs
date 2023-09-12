using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Results;
using RiskControl.VoidRejectRefund.Common;
using System.Threading.Tasks;

namespace RiskControl.VoidRejectRefund.Monthly;

[ApiController]
[Route("api/void-reject-refund/monthly")]
public class MonthlyModeController : ControllerBase
{
    private readonly IMediator mediator;

    public MonthlyModeController(IMediator mediator)
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
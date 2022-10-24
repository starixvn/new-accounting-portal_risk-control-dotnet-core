using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Results;
using RiskControl.VoidRejectRefund.Common;
using System.Threading.Tasks;

namespace RiskControl.VoidRejectRefund.Device
{
    [ApiController]
    [Route("api/void-reject-refund/device")]
    public class DeviceModeController : ControllerBase
    {
        private readonly IMediator mediator;

        public DeviceModeController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [Route("")]
        public async Task<IActionResult> Index(HttpParameterGroupJson httpParameter)
        {
            var viewModel = await mediator.Send(httpParameter).ConfigureAwait(false);
            return Ok(viewModel);
        }

        [Route("excel")]
        public async Task<IActionResult> Excel(HttpParameterGroupExcel httpParameter)
        {
            var excelPackage = await mediator.Send(httpParameter).ConfigureAwait(false);
            return new EpplusExcelResult(excelPackage);
        }
    }
}

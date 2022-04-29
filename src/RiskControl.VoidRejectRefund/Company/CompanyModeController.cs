using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Results;
using RiskControl.VoidRejectRefund.Common;
using System.Threading.Tasks;

namespace RiskControl.VoidRejectRefund.Company
{
    [Route("api/void-reject-refund/company")]
    public class CompanyModeController : ControllerBase
    {
        private readonly IMediator mediator;

        public CompanyModeController(IMediator mediator)
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

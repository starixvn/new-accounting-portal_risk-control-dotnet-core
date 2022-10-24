using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Results;
using System.Threading.Tasks;

namespace RiskControl.VoidRejectRefund.Product
{
    [ApiController]
    [Route("api/void-reject-refund/product")]
    public class ProductModeController : ControllerBase
    {
        private readonly IMediator mediator;

        public ProductModeController(IMediator mediator)
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
}

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using Olympus.WebApi.Results;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History
{
    [Route("NonSportsGamesStatistics/HourlyHistory")]
    [ValidationActionFilterAttribute]
    public class HourlyHistoryModeController : ControllerBase
    {
        private readonly IMediator mediator;

        public HourlyHistoryModeController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost, Route("Query")]
        public async Task<IActionResult> Query(QueryModel queryModel)
        {
            var result = await mediator.Send(queryModel).ConfigureAwait(false);
            return Ok(result);
        }

        [HttpPost, Route("Excel")]
        public async Task<IActionResult> Excel(QueryModelExcel queryModel)
        {
            var result = await mediator.Send(queryModel).ConfigureAwait(false);
            return new EpplusExcelResult(result);
        }
    }
}
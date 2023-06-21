using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.CompanyHistory
{
    [Route("NonSportsGamesStatistics/CompanyHistory")]
    [ValidationActionFilter]
    public class CompanyHistoryModeController : BaseController<QueryModel>
    {
        public CompanyHistoryModeController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost, Route("Query")]
        public override async Task<IActionResult> Query(QueryModel queryModel)
        {
            return await base.Query(queryModel).ConfigureAwait(false);
        }

        [HttpPost, Route("Excel")]
        public async Task<IActionResult> Excel(QueryModel queryModel)
        {
            var sheetName = $"{queryModel.ReportBy} Game Statistic";
            return await base.Excel(queryModel, sheetName).ConfigureAwait(false);
        }
    }
}
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.History
{
    [Route("NonSportsGamesStatistics/TopTwentyGroupStatisticHistory")]
    [ValidationActionFilter]
    public class TopTwentyGroupStatisticsHistoryModeController : BaseController<QueryModel>
    {
        public TopTwentyGroupStatisticsHistoryModeController(IMediator mediator) : base(mediator)
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
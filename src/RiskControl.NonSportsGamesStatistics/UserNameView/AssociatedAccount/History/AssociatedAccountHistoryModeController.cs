using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.History
{
    [Route("NonSportsGamesStatistics/AssociatedAccountHistory")]
    [ValidationActionFilter]
    public class AssociatedAccountHistoryModeController : BaseController<QueryModel>
    {
        public AssociatedAccountHistoryModeController(IMediator mediator) : base(mediator)
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
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyGrandTotalNormal;

[Route("NonSportsGamesStatistics/DailyGrandTotalNormal")]
public class DailyGrandTotalNormalModeController : BaseController<QueryModel>
{
    public DailyGrandTotalNormalModeController(IMediator mediator) : base(mediator)
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
        return await base.Excel(queryModel, "Grand Total by Currency").ConfigureAwait(false);
    }
}
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyViewGrandTotalHistory;

using Attributes;

[Route("NonSportsGamesStatistics/DailyViewGrandTotalHistory")]
[ValidationActionFilter]
public class DailyViewGrandTotalHistoryModeController(IMediator mediator) : BaseController<QueryModel>(mediator)
{
    [HttpPost, Route("Query")]
    public override Task<IActionResult> Query(QueryModel queryModel)
    {
        return base.Query(queryModel);
    }

    [HttpPost, Route("Excel")]
    public Task<IActionResult> Excel(QueryModel queryModel)
    {
        return base.Excel(queryModel, "Grand Total by Currency");
    }
}
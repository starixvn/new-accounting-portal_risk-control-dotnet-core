using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily.History;

using Attributes;

[Route("NonSportsGamesStatistics/DailyHistory")]
[ValidationActionFilter]
public class DailyHistoryModeController(IMediator mediator) : BaseController<QueryModel>(mediator)
{
    [Route("Query")]
    public override Task<IActionResult> Query(QueryModel queryModel)
    {
        return base.Query(queryModel);
    }

    [Route("Excel")]
    public Task<IActionResult> Excel(QueryModel queryModel)
    {
        return base.Excel(queryModel, SheetNameConstant.SHEETNAME);
    }
}
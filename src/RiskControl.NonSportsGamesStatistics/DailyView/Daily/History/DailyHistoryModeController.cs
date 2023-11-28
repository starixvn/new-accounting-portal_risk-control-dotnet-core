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
    public override async Task<IActionResult> Query(QueryModel queryModel)
    {
        return await base.Query(queryModel).ConfigureAwait(false);
    }

    [Route("Excel")]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        return await base.Excel(queryModel, SheetNameConstant.SHEETNAME).ConfigureAwait(false);
    }
}
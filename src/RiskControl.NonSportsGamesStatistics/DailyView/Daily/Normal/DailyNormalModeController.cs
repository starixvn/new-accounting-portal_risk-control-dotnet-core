using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily.Normal;

[Route("NonSportsGamesStatistics/DailyNormal")]
public class DailyNormalModeController(IMediator mediator) : BaseController<QueryModel>(mediator)
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
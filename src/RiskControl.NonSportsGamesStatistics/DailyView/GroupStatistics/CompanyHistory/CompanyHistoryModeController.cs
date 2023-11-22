using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.CompanyHistory;

using Attributes;

[Route("NonSportsGamesStatistics/CompanyHistory")]
[ValidationActionFilter]
public class CompanyHistoryModeController(IMediator mediator) : BaseController<QueryModel>(mediator)
{
    [HttpPost, Route("Query")]
    public override async Task<IActionResult> Query(QueryModel queryModel)
    {
        return await base.Query(queryModel).ConfigureAwait(false);
    }

    [HttpPost, Route("Excel")]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        return await base.Excel(queryModel, SheetNameConstant.SHEETNAME).ConfigureAwait(false);
    }
}
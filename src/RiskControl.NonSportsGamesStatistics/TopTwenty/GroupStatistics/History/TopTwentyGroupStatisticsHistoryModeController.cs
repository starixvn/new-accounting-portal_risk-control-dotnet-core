using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.History;

using Attributes;

[Route("NonSportsGamesStatistics/TopTwentyGroupStatisticHistory")]
[ValidationActionFilter]
public class TopTwentyGroupStatisticsHistoryModeController(IMediator mediator) : BaseController<QueryModel>(mediator)
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
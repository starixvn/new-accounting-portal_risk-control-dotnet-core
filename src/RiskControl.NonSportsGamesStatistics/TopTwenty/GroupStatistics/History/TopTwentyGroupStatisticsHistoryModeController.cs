using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.History;

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
        return await base.Excel(queryModel, SheetNameConstant.SHEETNAME).ConfigureAwait(false);
    }
}
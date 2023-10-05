using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily.History;

[Route("NonSportsGamesStatistics/DailyHistory")]
[ValidationActionFilter]
public class DailyHistoryModeController : BaseController<QueryModel>
{
    public DailyHistoryModeController(IMediator mediator) : base(mediator)
    {
    }

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
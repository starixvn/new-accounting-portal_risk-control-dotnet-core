using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main.History;

[Route("NonSportsGamesStatistics/DailyViewHistory")]
[ValidationActionFilter]
public class DailyViewHistoryModeController : BaseController<QueryModel>
{
    public DailyViewHistoryModeController(IMediator mediator) : base(mediator)
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
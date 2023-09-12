using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal.Normal;

[Route("NonSportsGamesStatistics/UserNameViewGrandTotalNormal")]
public class UserNameViewGrandTotalNormalModeController : BaseController<QueryModel>
{
    public UserNameViewGrandTotalNormalModeController(IMediator mediator) : base(mediator)
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
        var sheetName = $"{queryModel.ReportBy} Game Statistic";
        return await base.Excel(queryModel, sheetName).ConfigureAwait(false);
    }
}
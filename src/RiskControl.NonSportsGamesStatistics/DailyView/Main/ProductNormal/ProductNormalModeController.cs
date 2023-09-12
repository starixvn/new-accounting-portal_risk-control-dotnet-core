using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main.ProductNormal;

[Route("NonSportsGamesStatistics/ProductNormal")]
public class ProductNormalModeController : BaseController<QueryModel>
{
    public ProductNormalModeController(IMediator mediator) : base(mediator)
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
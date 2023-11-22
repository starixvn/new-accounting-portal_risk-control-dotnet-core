using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.History;

using Attributes;

[Route("NonSportsGamesStatistics/CurrencyViewGrandTotalHistory")]
[ValidationActionFilter]
public class CurrencyViewGrandTotalHistoryModeController : BaseController<QueryModel>
{
    public CurrencyViewGrandTotalHistoryModeController(IMediator mediator) : base(mediator)
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
        return await base.Excel(queryModel, SheetNameConstant.SHEETNAME).ConfigureAwait(false);
    }
}
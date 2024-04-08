using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Main;

[Route("NonSportsGamesStatistics/CurrencyView")]
[ValidationActionFilter]
public class CurrencyViewController(IMediator mediator): BaseController<QueryModel>(mediator)
{
    [HttpPost, Route("Query")]
    public override Task<IActionResult> Query(QueryModel queryModel)
    {
        return base.Query(queryModel);
    }

    [HttpPost, Route("Excel")]
    public Task<IActionResult> Excel(QueryModel queryModel)
    {
        return base.Excel(queryModel, SheetNameConstant.SHEETNAME);
    }
}
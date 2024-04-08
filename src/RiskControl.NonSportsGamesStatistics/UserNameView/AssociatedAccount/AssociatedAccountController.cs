using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount;

using Attributes;

[Route("NonSportsGamesStatistics/AssociatedAccount")]
[ValidationActionFilter]
public class AssociatedAccountController(IMediator mediator) : BaseController<QueryModel>(mediator)
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
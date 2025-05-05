using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.Company;

[Route("NonSportsGamesStatistics/Company")]
[ValidationActionFilter]
public class CompanyController(IMediator mediator) : BaseController<QueryModel>(mediator)
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
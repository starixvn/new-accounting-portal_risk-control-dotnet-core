using MediatR;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main.Product;

using Attributes;

[Route("NonSportsGamesStatistics/Product")]
[ValidationActionFilter]
public class ProductController(IMediator mediator) : BaseController<QueryModel>(mediator)
{
    [HttpPost, Route("Query")]
    public override Task<IActionResult> Query(QueryModel queryModel)
    {
        if (queryModel.ReportBy == ReportByConstant.PRODUCT)
        {
            queryModel.CasinoType = null;
        }
        return base.Query(queryModel);
    }

    [HttpPost, Route("Excel")]
    public Task<IActionResult> Excel(QueryModel queryModel)
    {
        if (queryModel.ReportBy == ReportByConstant.PRODUCT)
        {
            queryModel.CasinoType = null;
        }
        return base.Excel(queryModel, SheetNameConstant.SHEETNAME);
    }
}
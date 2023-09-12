using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.CasinoProduct;

[Route("NonSportsGamesStatistics/SpecificMember/CasinoProduct")]
[ValidationActionFilter]
public class SpecificMemberCasinoProductController : BaseController<QueryModel>
{
    public SpecificMemberCasinoProductController(IMediator mediator) : base(mediator)
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
        const string sheetName = "Product Game Statistic";
        return await base.Excel(queryModel, sheetName).ConfigureAwait(false);
    }
}
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly;

[Route("NonSportsGamesStatistics/SpecificMember/Monthly")]
[ValidationActionFilter]
public class SpecificMemberMonthlyController : BaseController<QueryModel>
{
    public SpecificMemberMonthlyController(IMediator mediator) : base(mediator)
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
        const string sheetName = "Monthly Game Statistic";
        return await base.Excel(queryModel, sheetName).ConfigureAwait(false);
    }
}
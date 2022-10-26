using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount
{
    [Route("NonSportsGamesStatistics/SpecificMember/AssociatedAccount")]
    [ValidationActionFilterAttribute]
    public class SpecificMemberAssociatedAccountController : BaseController<QueryModel>
    {
        public SpecificMemberAssociatedAccountController(IMediator mediator) : base(mediator)
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
            const string sheetName = $"Member Game Statistic";
            return await base.Excel(queryModel, sheetName).ConfigureAwait(false);
        }
    }
}
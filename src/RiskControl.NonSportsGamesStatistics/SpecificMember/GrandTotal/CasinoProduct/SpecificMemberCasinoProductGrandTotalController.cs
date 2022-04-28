using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.CasinoProduct
{
    [Route("NonSportsGamesStatistics/SpecificMember/CasinoProductGrandTotal")]
    [ValidationActionFilterAttribute]
    public class SpecificMemberCasinoProductGrandTotalController : BaseController<QueryModel>
    {
        public SpecificMemberCasinoProductGrandTotalController(IMediator mediator) : base(mediator)
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
            string sheetName = $"Grand Total by Currency";
            return await base.Excel(queryModel, sheetName).ConfigureAwait(false);
        }
    }
}
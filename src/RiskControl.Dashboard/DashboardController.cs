using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Dashboard.Criteria;
using RiskControl.Dashboard.Model;
using System.Threading.Tasks;

namespace RiskControl.Dashboard
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDynamicRepository repository;

        public DashboardController(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        [Route("currency-netincome")]
        [HttpGet]
        [ResponseCache(Duration = 86400)]
        public async Task<IActionResult> CurrencyNetIncome()
        {
            var criteria = new CurrencyNetIncomeCriteria();
            var result = await repository.FetchAsync<CurrencyNetIncome>(criteria);

            return Ok(result);
        }

        [Route("monthly-turnover-netincome")]
        [HttpGet]
        [ResponseCache(Duration = 86400)]
        public async Task<IActionResult> MonthlyTurnoverAndNetIncome()
        {
            var criteria = new MonthlyTurnoverAndNetIncomeCriteria();
            var result = await repository.FetchAsync<MonthlyTurnoverAndNetIncome>(criteria);
            return Ok(result);
        }

        [Route("product-turnover")]
        [HttpGet]
        [ResponseCache(Duration = 86400)]
        public async Task<IActionResult> ProductTurnover()
        {
            var criteria = new ProductTurnoverCriteria();
            var result = await repository.FetchAsync<ProductTurnover>(criteria);
            return Ok(result);
        }

        [Route("top-gametype-winning")]
        [HttpGet]
        [ResponseCache(Duration = 86400)]
        public async Task<IActionResult> TopGameTypeWinning()
        {
            var criteria = new TopGameTypeWinningCriteria();
            var result = await repository.FetchAsync<TopGameTypeWinning>(criteria);
            return Ok(result);
        }

        [Route("top-member-winning")]
        [HttpGet]
        [ResponseCache(Duration = 86400)]
        public async Task<IActionResult> TopMemberWinning()
        {
            var criteria = new TopMemberWinningCriteria();
            var result = await repository.FetchAsync<TopMemberWinning>(criteria);
            return Ok(result);
        }

        [Route("winloss-limit")]
        [HttpGet]
        public async Task<IActionResult> WinLossLimit()
        {
            var criteria = new WinLossLimitCriteria();
            var result = await repository.FetchAsync<WinLossLimit>(criteria);
            return Ok(result);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Filter
{
    [ApiController]
    [Route("api/win-limit-control/filter")]
    public class FilterController : ControllerBase
    {
        private readonly FilterService filterService;

        public FilterController(FilterService filterService)
        {
            this.filterService = filterService;
        }

        [Route("get-sites")]
        [HttpPost]
        public async Task<IActionResult> GetSiteLicensees(GetSiteCriteria criteria)
        {
            var licensees = await filterService.GetSiteByProduct(criteria);
            return Ok(licensees);
        }

        [Route("get-currencies")]
        [HttpPost]
        public async Task<IActionResult> GetCurrencies(GetCurrencyCriteria criteria)
        {
            var currencies = (await filterService.GetCurrencies(criteria)).ToList();
            return Ok(currencies);
        }

        [Route("get-products")]
        [HttpPost]
        public IActionResult GetProducts()
        {
            var products = filterService.GetProducts();
            return Ok(products);
        }

        [Route("search-users")]
        public async Task<IActionResult> SearchUsers(string term)
        {
            var criteria = new CustomerSuggestionCriteria { CustomerName = term.Trim() };
            var customers = await filterService.SearchUsers(criteria);
            var userNames = customers.Select(customer => customer.Username);
            return Ok(userNames);
        }

        [Route("get-groups")]
        [HttpPost]
        public async Task<IActionResult> GetGroups(GetGroupCriteria criteria)
        {
            var groups = (await filterService.GetGroupByProduct(criteria)).ToList();
            return Ok(groups);
        }
    }
}
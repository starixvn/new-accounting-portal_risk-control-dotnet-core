using Microsoft.AspNetCore.Mvc;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Filter
{
    [Route("api/win-limit-control/filter")]
    public class FilterController : Controller
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
            var licensees = await filterService.GetSiteByProduct(criteria).ConfigureAwait(false);
            return Json(licensees);
        }

        [Route("get-currencies")]
        [HttpPost]
        public async Task<IActionResult> GetCurrencies(GetCurrencyCriteria criteria)
        {
            var currencies = (await filterService.GetCurrencies(criteria).ConfigureAwait(false)).ToList();
            return Json(currencies);
        }

        [Route("get-products")]
        [HttpPost]
        public IActionResult GetProducts()
        {
            var products = filterService.GetProducts();
            return Json(products);
        }

        [Route("search-users")]
        [HttpGet]
        public async Task<IActionResult> SearchUsers(string term)
        {
            var criteria = new CustomerSuggestionCriteria { CustomerName = term.Trim() };
            var customers = await filterService.SearchUsers(criteria).ConfigureAwait(false);
            var userNames = customers.Select(customer => customer.Username);
            return Json(userNames);
        }
    }
}
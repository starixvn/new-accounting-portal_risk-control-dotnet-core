using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
[Route("NonSportsGamesStatistics/Currency")]
public class CurrencyController(IDynamicRepository repository) : ControllerBase
{
    [Route("Query")]
    public async Task<IEnumerable<CurrencyModel>> Query(CurrencyCriteria criteria)
    {
        var currencies = await repository.FetchAsync<CurrencyModel>(criteria).ConfigureAwait(false);
        return currencies.OrderBy(r => r.Currency);
    }
}
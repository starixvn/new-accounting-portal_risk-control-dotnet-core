using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
[Route("NonSportsGamesStatistics/Site")]
public class SiteController(FilterService service) : ControllerBase
{
    [Route("Query")]
    [HttpGet]
    public async Task<List<SiteGroupModel>> Query(string productId)
    {
        return await service.GetSiteGroups(productId);
    }
}
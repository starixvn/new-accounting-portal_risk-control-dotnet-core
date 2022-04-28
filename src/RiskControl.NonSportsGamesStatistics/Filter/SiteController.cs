using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter
{
    [Route("NonSportsGamesStatistics/Site")]
    public class SiteController : ControllerBase
    {
        private readonly FilterService service;

        public SiteController(FilterService service)
        {
            this.service = service;
        }

        [Route("Query")]
        [HttpGet]
        public async Task<List<SiteGroupModel>> Query(string productId)
        {
            return await service.GetSiteGroups(productId);
        }
    }
}
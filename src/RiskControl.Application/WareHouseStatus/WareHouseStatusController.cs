using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.Application.WareHouseStatus
{
    public class WareHouseStatusController : ControllerBase
    {
        private readonly IDynamicRepository repository;

        public WareHouseStatusController(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        [Route("api/application/is-data-warehouse-ready")]
        public async Task<IActionResult> Post()
        {
            var criteria = new Criteria();
            var dataRange = await repository.FetchAsync<WareHouseDataRange>(criteria).ConfigureAwait(false);
            var lastDate = dataRange.Max(d => d.LastDate);
            var yesterday = DateTime.Today.AddDays(-1);
            var dataIsReady = lastDate >= yesterday;
            return Ok(dataIsReady);
        }
    }
}

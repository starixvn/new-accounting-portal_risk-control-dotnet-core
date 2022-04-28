using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter
{
    [Route("NonSportsGamesStatistics/GameType")]
    public class GameTypeController : ControllerBase
    {
        private readonly IDynamicRepository repository;

        public GameTypeController(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        [Route("Query")]
        [HttpGet]
        public async Task<List<GameTypeModel>> Query()
        {
            var criteria = new GameTypeCriteria();
            return await repository.FetchAsync<GameTypeModel>(criteria).ConfigureAwait(false) as List<GameTypeModel>;
        }
    }
}
using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
[Route("NonSportsGamesStatistics/GameTable")]
public class GameTableController : ControllerBase
{
    private readonly IDynamicRepository repository;

    public GameTableController(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    [Route("Query")]
    [HttpGet]
    public async Task<List<GameTableModel>> Query()
    {
        var criteria = new GameTableCriteria();
        return await repository.FetchAsync<GameTableModel>(criteria).ConfigureAwait(false) as List<GameTableModel>;
    }
}
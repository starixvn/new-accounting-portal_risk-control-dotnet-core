using Fanex.Data.Repository;
using Fanex.Logging;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
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

    [Route("WriteGameTypeLog")]
    [HttpPost]
    public async Task WriteGameTypeLog(DataLogModel data)
    {
        await LogService.InfoAsync($"Logs - GameTypes: {JsonConvert.SerializeObject(data.GameTypes)}");
        await LogService.InfoAsync($"Logs - Product: {JsonConvert.SerializeObject(data.Product)}");
        await LogService.InfoAsync($"Logs - SelectedGameTypes: {JsonConvert.SerializeObject(data.SelectedGameTypes)}");
    }
}
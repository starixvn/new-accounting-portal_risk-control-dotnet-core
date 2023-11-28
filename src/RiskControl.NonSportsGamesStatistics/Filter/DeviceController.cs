using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
[Route("NonSportsGamesStatistics/Device")]
public class DeviceController(IDynamicRepository repository) : ControllerBase
{
    [Route("Query")]
    [HttpGet]
    public async Task<List<DeviceModel>> Query()
    {
        var criteria = new DeviceCriteria();
        return await repository.FetchAsync<DeviceModel>(criteria).ConfigureAwait(false) as List<DeviceModel>;
    }
}
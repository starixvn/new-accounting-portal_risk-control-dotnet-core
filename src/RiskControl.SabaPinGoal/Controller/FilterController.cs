using Microsoft.AspNetCore.Mvc;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/filter")]
public class FilterController(FilterService service) : ControllerBase
{
    [Route("companies")]
    [HttpPost]
    public async Task<IActionResult> GetCompanies()
    {
        var data = await service.GetCompanies();
        return Ok(data);
    }

    [Route("sports")]
    [HttpPost]
    public async Task<IActionResult> GetSports()
    {
        var data = await service.GetSports();
        return Ok(data);
    }

    [Route("league-groups")]
    [HttpPost]
    public async Task<IActionResult> GetLeagueGroups()
    {
        var data = await service.GetLeagueGroups();
        return Ok(data);
    }
}
using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Dashboard.Criteria;
using RiskControl.Dashboard.Model;
using System.Threading.Tasks;

namespace RiskControl.Dashboard;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDynamicRepository repository;

    public DashboardController(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    [Route("weekly-net-income")]
    [HttpGet]
    public async Task<IActionResult> WeeklyNetIncome()
    {
        var criteria = new WeeklyNetIncomeCriteria();
        var result = await repository.FetchAsync<WeeklyNetIncomeModel>(criteria);
        return Ok(result);
    }

    [Route("total-players-by-device")]
    [HttpGet]
    public async Task<IActionResult> TotalPlayersByDevice()
    {
        var criteria = new TotalPlayersByDeviceCriteria();
        var result = await repository.FetchAsync<TotalPlayersByDeviceModel>(criteria);
        return Ok(result);
    }

    [Route("top-gametype-winning")]
    [HttpGet]
    public async Task<IActionResult> TopGameTypeWinning()
    {
        var criteria = new TopGameTypeWinningCriteria();
        var result = await repository.FetchAsync<TopGameTypeWinning>(criteria);
        return Ok(result);
    }

    [Route("top-member-winning")]
    [HttpGet]
    public async Task<IActionResult> TopMemberWinning(bool isDeposit)
    {
        var criteria = new TopMemberWinningCriteria { IsDeposit = isDeposit };
        var result = await repository.FetchAsync<TopMemberWinning>(criteria);
        return Ok(result);
    }
}
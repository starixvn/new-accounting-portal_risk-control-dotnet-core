using Microsoft.AspNetCore.Mvc;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Service;

namespace RiskControl.FailSafeSystem.Controller;

[ApiController]
[Route("api/fail-safe-system")]
public class FailSafeSystemApiController(FailSafeSystemService service) : ControllerBase
{
    [Route("setting/rule-title")]
    [HttpPost]
    public async Task<IActionResult> GetRuleTitles()
    {
        var data = await service.GetRuleTitles();
        return Ok(data);
    }

    [Route("setting/product")]
    [HttpPost]
    public async Task<IActionResult> GetProducts()
    {
        var data = await service.GetProducts();
        return Ok(data);
    }

    [Route("setting/data")]
    [HttpPost]
    public async Task<IActionResult> GetSettings(SettingCriteria criteria)
    {
        var data = await service.GetSettings(criteria);
        return Ok(data);
    }

    [Route("setting/add-rule")]
    [HttpPost]
    public async Task<IActionResult> AddRule(AddRuleCriteria criteria)
    {
        _ = await service.AddRule(criteria);
        return Ok(true);
    }

    [Route("setting/edit-rule")]
    [HttpPost]
    public async Task<IActionResult> EditRule(EditRuleCriteria criteria)
    {
        _ = await service.EditRule(criteria);
        return Ok(true);
    }

    [Route("setting/delete-rule")]
    [HttpPost]
    public async Task<IActionResult> DeleteRule(DeleteRuleCriteria criteria)
    {
        _ = await service.DeleteRule(criteria);
        return Ok(true);
    }
}
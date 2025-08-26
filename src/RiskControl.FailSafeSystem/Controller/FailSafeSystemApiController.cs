using Fanex.NAP.Client.Helpers.Business;
using Microsoft.AspNetCore.Mvc;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Service;
using RiskControl.Model;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.FailSafeSystem.Controller;

[ApiController]
[Route("api/fail-safe-system")]
public class FailSafeSystemApiController(FailSafeSystemService service, AuthorizationService authorizationService) : ControllerBase
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

    [Route("host-permission")]
    [HttpPost]
    public IActionResult HasHostPermission()
    {
        var hasHostPermission = authorizationService.HasPermission(FunctionKeys.FailSafeSystemSetting, Constant.Policy.Host);
        return Ok(hasHostPermission);
    }

    [Route("monitor/data")]
    [HttpPost]
    public async Task<IActionResult> GetMonitor(MonitorCriteria criteria)
    {
        var data = await service.GetMonitors(criteria);
        return Ok(data);
    }

    [Route("manage-product-status/data")]
    [HttpPost]
    public async Task<IActionResult> GetManageProductStatus(ManageProductStatusCriteria criteria)
    {
        var data = await service.GetManageProductStatus(criteria);
        return Ok(data);
    }

    [Route("manage-product-status/history-data")]
    [HttpPost]
    public async Task<IActionResult> GetProductStatusHistory(ProductStatusHistoryCriteria criteria)
    {
        var data = await service.GetProductStatusHistory(criteria);
        return Ok(data);
    }
}
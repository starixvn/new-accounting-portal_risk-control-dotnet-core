using RiskControl.Model;
using RiskControl.WinLossLimitControl.Services;
using RiskControl.WinLossLimitControl.Filter.Model;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.Filter;

using Fanex.NAP.Client.Helpers.Business;

[Route("state-api/win-limit-control/authorization")]
public class AuthorizationController(AuthorizationService authorizationService) : ControllerBase
{
    [Route("host-permission")]
    [HttpPost]
    public IActionResult HasHostPermission()
    {
        var playerWinLimitManagement = authorizationService.HasPermission(FunctionKeys.PlayerWinLimitManagement, Constant.Policy.Host);
        var currencyWinLimitSetting = authorizationService.HasPermission(FunctionKeys.CurrencyWinLimitSetting, Constant.Policy.Host);
        var winLimitMonitor = authorizationService.HasPermission(FunctionKeys.WinLimitMonitor, Constant.Policy.Host);
        var hostPermission = new HostPermission
        {
            PlayerWinLimitManagement = playerWinLimitManagement,
            CurrencyWinLimitSetting = currencyWinLimitSetting,
            WinLimitMonitor = winLimitMonitor
        };
        return Ok(hostPermission);
    }
}
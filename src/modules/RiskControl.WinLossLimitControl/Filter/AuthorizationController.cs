using Microsoft.AspNetCore.Mvc;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Configurations;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.Filter
{
    [Route("state-api/win-limit-control/authorization")]
    public class AuthorizationController : Controller
    {
        private readonly AuthorizationService authorizationService;

        public AuthorizationController(AuthorizationService authorizationService)
        {
            this.authorizationService = authorizationService;
        }

        [Route("host-permission")]
        [HttpPost]
        public IActionResult HasHostPermission()
        {
            var hasHostPermission = authorizationService.HasPermission(FunctionKeys.PlayerWinLimitManagement, Policy.Write);
            return Json(hasHostPermission);
        }
    }
}
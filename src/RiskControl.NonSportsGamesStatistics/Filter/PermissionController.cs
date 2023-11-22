using System.Linq;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;
using RiskControl.NonSportsGamesStatistics.Filter.Model;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
[Route("state-api/NonSportsGamesStatistics/Permission")]
public class PermissionController(IUserService userService, INapSession napSession, INapSettings napSettings)
    : ControllerBase
{
    [Route("Query")]
    [HttpGet]
    public Permission Query()
    {
        var modePermissions = userService.GetPermissions(napSession.UserId, napSettings.SiteId, FunctionKeys.NonSportGameStatisticsModePermission)
            .Where(x => x.Policy == 1)
            .Select(x => x.Name);
        var productPermissions = userService.GetPermissions(napSession.UserId, napSettings.SiteId, FunctionKeys.NonSportGameStatisticsProductPermission)
            .Where(x => x.Policy == 1)
            .Select(x => x.Name);
        return new Permission
        {
            Modes = modePermissions,
            Products = productPermissions
        };
    }
}
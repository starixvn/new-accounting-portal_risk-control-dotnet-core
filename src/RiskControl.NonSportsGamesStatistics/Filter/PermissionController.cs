using System.Linq;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;
using RiskControl.NonSportsGamesStatistics.Filter.Model;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
[Route("state-api/NonSportsGamesStatistics/Permission")]
public class PermissionController : ControllerBase
{
    private readonly IUserService userService;
    private readonly INapSession napSession;
    private readonly INapSettings napSettings;

    public PermissionController(IUserService userService, INapSession napSession, INapSettings napSettings)
    {
        this.userService = userService;
        this.napSession = napSession;
        this.napSettings = napSettings;
    }

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
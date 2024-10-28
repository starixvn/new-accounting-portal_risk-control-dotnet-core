using Fanex.NAP.Client.Services;

namespace RiskControl.WinLossLimitControl.Services;

using Fanex.NAP.Client;
using Fanex.NAP.Client.Helpers.Business;

public interface AuthorizationService
{
    bool HasPermission(string functionKey, Constant.Policy policy);
}

public class AuthorizationServiceImp(IUserService userService, INapSession sessionService,
        UserHttpContext userHttpContext)
    : AuthorizationService
{
    public bool HasPermission(string functionKey, Constant.Policy policy)
    {
        var functionPolicy = userService.GetPermission(sessionService.UserId, userHttpContext.SiteId, functionKey);
        return functionPolicy >= (int)policy;
    }
}
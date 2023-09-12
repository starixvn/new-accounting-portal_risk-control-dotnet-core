using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;

namespace RiskControl.WinLossLimitControl.Services
{
    using Fanex.NAP.Client.Helpers.Business;

    public interface AuthorizationService
    {
        bool HasPermission(string functionKey, Constant.Policy policy);
    }

    public class AuthorizationServiceImp : AuthorizationService
    {
        private readonly IUserService userService;

        private readonly INapSession sessionService;

        private readonly UserHttpContext userHttpContext;

        public AuthorizationServiceImp(IUserService userService, INapSession sessionService, UserHttpContext userHttpContext)
        {
            this.userService = userService;
            this.sessionService = sessionService;
            this.userHttpContext = userHttpContext;
        }

        public bool HasPermission(string functionKey, Constant.Policy policy)
        {
            var functionPolicy = userService.GetPermission(sessionService.UserId, userHttpContext.SiteId, functionKey);
            return functionPolicy >= (int)policy;
        }
    }
}
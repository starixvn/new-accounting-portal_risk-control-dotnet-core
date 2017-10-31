using MediatR;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.MediatRModels;
using RiskControl.Account.Models;
using RiskControl.Account.Services;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.Account.Handlers
{
    public class RefreshHandler : IAsyncRequestHandler<RefreshRequest, string>
    {
        private readonly UserService userService;

        private readonly SecurityService securityService;

        private readonly StateService stateService;

        private readonly TokenGenerator tokenGenerator;

        public RefreshHandler(SecurityService securityService, StateService stateService, TokenGenerator tokenGenerator, UserService userService)
        {
            this.securityService = securityService;
            this.stateService = stateService;
            this.tokenGenerator = tokenGenerator;
            this.userService = userService;
        }

        public async Task<string> Handle(RefreshRequest message)
        {
            var isKickedOut = await securityService.ReCheckIn(stateService.OnUserId).ConfigureAwait(false) > 0;
            if (isKickedOut)
            {
                return string.Empty;
            }

            var user = await userService.Get(stateService.UserId).ConfigureAwait(false);
            var functions = await GetFunctions(stateService.UserId).ConfigureAwait(false);
            return tokenGenerator.GetToken(stateService.OnUserId, user, functions);
        }

        private async Task<FunctionLite[]> GetFunctions(int userId)
        {
            var functions = await userService.GetPermissions(userId, string.Empty).ConfigureAwait(false);
            return functions.Select(f => new FunctionLite(f.Function.Key, f.Policy)).ToArray();
        }
    }
}

using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Newtonsoft.Json;
using Olympus.DotNetCore.Maintenance;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Models;
using Olympus.DotNetCore.NapApiClient.Models.ParameterObject;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.MediatRModels;
using RiskControl.Account.Models;
using RiskControl.Account.Services;

namespace RiskControl.Account.Handlers {
    public class LoginHandler : LoginHandlerBase, IRequestHandler<LoginRequest, LoginResponse> {
        private readonly GroupService groupService;

        private readonly CurrentContextService currentContextService;

        private readonly SecurityService securityService;

        public LoginHandler (
            UserService userService,
            GroupService groupService,
            CurrentContextService currentContextService,
            SecurityService securityService,
            MaintenanceServiceFactory maintenanceServiceFactory,
            TokenGenerator tokenGenerator) : base (userService, maintenanceServiceFactory, tokenGenerator) {
            this.groupService = groupService;
            this.currentContextService = currentContextService;
            this.securityService = securityService;
        }

        public async Task<LoginResponse> Handle (LoginRequest request, CancellationToken cancellationToken) {
            var user = await userService.Get (request.Username, request.Password).ConfigureAwait (false);

            var onUserId = await CheckIn (user).ConfigureAwait (false);

            return await GetLoggedInInformation (onUserId, request.MaintenanceToken, user).ConfigureAwait (false);
        }

        private async Task<int> CheckIn (User user) {
            var loginParameter = new LoginParameter {
                UserId = user.Id,
                NetSessionId = Guid.NewGuid ().ToString (),
                Ip = currentContextService.GetIP (),
                LoginDate = DateTime.Now,
                BrowserName = currentContextService.GetBrowserName (),
                CountryCode = currentContextService.GetCountryCode (),
                Domain = currentContextService.GetDomainName (),
                Platform = currentContextService.GetPlatform ()
            };

            return await securityService.Login (loginParameter).ConfigureAwait (false);
        }
    }
}
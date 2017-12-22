using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Newtonsoft.Json;
using Olympus.DotNetCore.Cryptography;
using Olympus.DotNetCore.Maintenance;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Exceptions;
using Olympus.DotNetCore.NapApiClient.Models;
using Olympus.DotNetCore.NapApiClient.Models.ParameterObject;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.MediatRModels;
using RiskControl.Account.Models;
using RiskControl.Account.Services;

namespace RiskControl.Account.Handlers {
    public class LoginSsoHandler : LoginHandlerBase, IRequestHandler<SsoRequest, LoginResponse> {
        private const int TimeExipration = 60;

        private readonly GroupService groupService;

        private readonly CurrentContextService currentContextService;

        private readonly SecurityService securityService;

        public LoginSsoHandler (
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

        public async Task<LoginResponse> Handle (SsoRequest request, CancellationToken cancellationToken) {
            var currentTime = securityService.GetTime ();

            var userIdInString = CryptographyEncoding.CfsDeCrypt (request.UserId.Replace (" ", "+"));
            var onUserIdInString = CryptographyEncoding.CfsDeCrypt (request.OnUserId.Replace (" ", "+"));
            var time = CryptographyEncoding.CfsDeCrypt (request.Time.Replace (" ", "+"));

            var userId = int.Parse (userIdInString);
            var onUserId = int.Parse (onUserIdInString);
            var expiration = Convert.ToDateTime (currentTime) - Convert.ToDateTime (time);

            if (expiration.TotalSeconds <= TimeExipration) {
                onUserId = await CheckIn (userId, onUserId);

                var user = await userService.Get (userId);
                return await GetLoggedInInformation (onUserId, string.Empty, user);
            } else {
                throw new LoginException ($"{userId} cannot login via SSO because of the ticket expiration");
            }
        }

        private async Task<int> CheckIn (int userId, int onUserId) {
            var parameter = new SSOLoginParameter {
                UserId = userId,
                CheckOnUserId = onUserId,
                OnUserId = 0,
                IP = currentContextService.GetIP (),
                NetSessionId = Guid.NewGuid ().ToString (),
                LoginDate = DateTime.Now,
                BrowserName = currentContextService.GetBrowserName (),
                CountryCode = currentContextService.GetCountryCode (),
                Domain = currentContextService.GetDomainName (),
                Platform = currentContextService.GetPlatform ()
            };

            return await securityService.SSOLogin (parameter);
        }
    }
}
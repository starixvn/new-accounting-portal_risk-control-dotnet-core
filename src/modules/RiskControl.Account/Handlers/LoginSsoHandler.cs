using MediatR;
using Newtonsoft.Json;
using Olympus.DotNetCore.Cryptography;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Exceptions;
using Olympus.DotNetCore.NapApiClient.Models.ParameterObject;
using Olympus.DotNetCore.NapApiClient.Models;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.MediatRModels;
using RiskControl.Account.Models;
using RiskControl.Account.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace RiskControl.Account.Handlers
{
    public class LoginSsoHandler : LoginHandlerBase, IAsyncRequestHandler<SsoRequest, LoginResponse>
    {
        private const int TimeExipration = 60;

        private readonly GroupService groupService;

        private readonly CurrentContextService currentContextService;

        private readonly SecurityService securityService;

        public LoginSsoHandler(UserService userService, GroupService groupService, CurrentContextService currentContextService, SecurityService securityService, TokenGenerator tokenGenerator)
        : base(userService, tokenGenerator)
        {

            this.groupService = groupService;
            this.currentContextService = currentContextService;
            this.securityService = securityService;
        }

        public async Task<LoginResponse> Handle(SsoRequest message)
        {
            var currentTime = securityService.GetTime();

            var userIdInString = CryptographyEncoding.CfsDeCrypt(message.UserId.Replace(" ", "+"));
            var onUserIdInString = CryptographyEncoding.CfsDeCrypt(message.OnUserId.Replace(" ", "+"));
            var time = CryptographyEncoding.CfsDeCrypt(message.Time.Replace(" ", "+"));

            var userId = int.Parse(userIdInString);
            var onUserId = int.Parse(onUserIdInString);
            var expiration = Convert.ToDateTime(currentTime) - Convert.ToDateTime(time);

            if (expiration.TotalSeconds <= TimeExipration)
            {
                onUserId = await CheckIn(userId, onUserId);

                var user = await userService.Get(userId);
                return await GetLoggedInInformation(onUserId, user);
            }
            else
            {
                throw new LoginException($"{userId} cannot login via SSO because of the ticket expiration");
            }
        }

        private async Task<int> CheckIn(int userId, int onUserId)
        {
            var parameter = new SSOLoginParameter
            {
                UserId = userId,
                CheckOnUserId = onUserId,
                OnUserId = 0,
                IP = currentContextService.GetIP(),
                NetSessionId = Guid.NewGuid().ToString(),
                LoginDate = DateTime.Now,
                BrowserName = currentContextService.GetBrowserName(),
                CountryCode = currentContextService.GetCountryCode(),
                Domain = currentContextService.GetDomainName(),
                Platform = currentContextService.GetPlatform()
            };

            return await securityService.SSOLogin(parameter);
        }
    }
}

using MediatR;
using Newtonsoft.Json;
using Olympus.DotNetCore.NapApiClient.Configuration;
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
    public class LoginHandler : LoginHandlerBase, IAsyncRequestHandler<LoginRequest, LoginResponse>
    {
        private readonly GroupService groupService;

        private readonly CurrentContextService currentContextService;

        private readonly SecurityService securityService;

        public LoginHandler(UserService userService, GroupService groupService, CurrentContextService currentContextService, SecurityService securityService, TokenGenerator tokenGenerator)
        : base(userService, tokenGenerator)
        {
            this.groupService = groupService;
            this.currentContextService = currentContextService;
            this.securityService = securityService;
        }

        public async Task<LoginResponse> Handle(LoginRequest message)
        {
            var user = await userService.Get(message.Username, message.Password).ConfigureAwait(false);

            var onUserId = await CheckIn(user).ConfigureAwait(false);

            return await GetLoggedInInformation(onUserId, user).ConfigureAwait(false);
        }

        private async Task<int> CheckIn(User user)
        {
            var loginParameter = new LoginParameter
            {
                UserId = user.Id,
                NetSessionId = Guid.NewGuid().ToString(),
                Ip = currentContextService.GetIP(),
                LoginDate = DateTime.Now,
                BrowserName = currentContextService.GetBrowserName(),
                CountryCode = currentContextService.GetCountryCode(),
                Domain = currentContextService.GetDomainName(),
                Platform = currentContextService.GetPlatform()
            };

            return await securityService.Login(loginParameter).ConfigureAwait(false);
        }
    }
}

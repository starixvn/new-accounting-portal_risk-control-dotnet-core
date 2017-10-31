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
    public class LoginHandlerBase
    {
        protected readonly UserService userService;

        protected readonly TokenGenerator tokenGenerator;

        public LoginHandlerBase(UserService userService, TokenGenerator tokenGenerator)
        {
            this.userService = userService;
            this.tokenGenerator = tokenGenerator;
        }

        protected async Task<LoginResponse> GetLoggedInInformation(int onUserId, User user)
        {
            var menus = await GetMenus(user.Id).ConfigureAwait(false);
            var functions = await GetFunctions(user.Id).ConfigureAwait(false);
            var token = tokenGenerator.GetToken(onUserId, user, functions);

            return new LoginResponse
            {
                Username = user.Username,
                Token = token,
                Menus = menus,
                Functions = functions
            };
        }

        protected async Task<MenuItem[]> GetMenus(int userId)
        {
            var menus = await userService.GetMenuItem(userId, true)
                        .ConfigureAwait(false);
            return menus.ToArray();
        }

        protected async Task<FunctionLite[]> GetFunctions(int userId)
        {
            var functions = await userService.GetPermissions(userId, string.Empty).ConfigureAwait(false);
            return functions.Select(f => new FunctionLite(f.Function.Key, f.Policy)).ToArray();
        }
    }
}

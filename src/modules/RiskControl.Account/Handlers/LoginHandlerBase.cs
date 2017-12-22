using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
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
    public class LoginHandlerBase {
        protected readonly UserService userService;

        private readonly MaintenanceService maintenanceService;

        protected readonly TokenGenerator tokenGenerator;

        public LoginHandlerBase (UserService userService, MaintenanceServiceFactory maintenanceServiceFactory, TokenGenerator tokenGenerator) {
            this.userService = userService;
            this.tokenGenerator = tokenGenerator;
            this.maintenanceService = maintenanceServiceFactory.CreateMaintenanceService ();
        }

        protected async Task<LoginResponse> GetLoggedInInformation (int onUserId, string maintenanceToken, User user) {
            var menus = await GetMenus (user.Id).ConfigureAwait (false);
            var functions = await GetFunctions (user.Id).ConfigureAwait (false);
            var maintenanceClaim = GetMaintenanceClaim (maintenanceToken);
            var token = tokenGenerator.GetToken (onUserId, user, functions, maintenanceClaim);

            return new LoginResponse {
                Username = user.Username,
                Token = token,
                Menus = menus,
                Functions = functions
            };
        }

        protected async Task<MenuItem[]> GetMenus (int userId) {
            var menus = await userService.GetMenuItem (userId, true)
                .ConfigureAwait (false);
            return menus.ToArray ();
        }

        protected async Task<FunctionLite[]> GetFunctions (int userId) {
            var functions = await userService.GetPermissions (userId, string.Empty).ConfigureAwait (false);
            return functions.Select (f => new FunctionLite (f.Function.Key, f.Policy)).ToArray ();
        }

        private Claim GetMaintenanceClaim (string maintenanceToken) {
            var isValidToken = !string.IsNullOrEmpty (maintenanceToken) && maintenanceService.IsTokenValid (maintenanceToken);
            return isValidToken ? new Claim (NapClaimTypes.MaintenanceToken, maintenanceToken) : null;
        }
    }
}
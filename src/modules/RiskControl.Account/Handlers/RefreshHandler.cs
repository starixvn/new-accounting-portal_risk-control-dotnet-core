using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.Maintenance;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.MediatRModels;
using RiskControl.Account.Models;
using RiskControl.Account.Services;

namespace RiskControl.Account.Handlers {
    public class RefreshHandler : IRequestHandler<RefreshRequest, string> {
        private readonly UserService userService;

        private readonly SecurityService securityService;

        private readonly StateService stateService;

        private readonly MaintenanceService maintenanceService;

        private readonly TokenGenerator tokenGenerator;

        public RefreshHandler (
            SecurityService securityService,
            StateService stateService,
            UserService userService,
            MaintenanceServiceFactory maintenanceServiceFactory,
            TokenGenerator tokenGenerator) {
            this.securityService = securityService;
            this.stateService = stateService;
            this.tokenGenerator = tokenGenerator;
            this.userService = userService;
            this.maintenanceService = maintenanceServiceFactory.CreateMaintenanceService ();
        }

        public async Task<string> Handle (RefreshRequest request, CancellationToken cancellationToken) {
            var isKickedOut = await securityService.ReCheckIn (stateService.OnUserId).ConfigureAwait (false) > 0;
            if (isKickedOut) {
                return string.Empty;
            }

            var user = await userService.Get (stateService.UserId).ConfigureAwait (false);
            var functions = await GetFunctions (stateService.UserId).ConfigureAwait (false);
            var maintenanceClaim = GetMaintenanceClaim (stateService.MaintenanceToken);
            return tokenGenerator.GetToken (stateService.OnUserId, user, functions, maintenanceClaim);
        }

        private async Task<FunctionLite[]> GetFunctions (int userId) {
            var functions = await userService.GetPermissions (userId, string.Empty).ConfigureAwait (false);
            return functions.Select (f => new FunctionLite (f.Function.Key, f.Policy)).ToArray ();
        }

        private Claim GetMaintenanceClaim (string maintenanceToken) {
            var isValidToken = !string.IsNullOrEmpty (maintenanceToken) && maintenanceService.IsTokenValid (maintenanceToken);
            return isValidToken ? new Claim (NapClaimTypes.MaintenanceToken, maintenanceToken) : null;
        }
    }
}
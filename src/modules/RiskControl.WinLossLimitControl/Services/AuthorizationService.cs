using System.Linq;
using Olympus.DotNetCore.Authentication;

namespace RiskControl.WinLossLimitControl.Services
{
    public interface AuthorizationService {
        bool HasPermission (string functionKey, Policy policy);
    }

    public class AuthorizationServiceImp : AuthorizationService {
        private readonly StateService stateService;

        public AuthorizationServiceImp (StateService stateService) {
            this.stateService = stateService;
        }

        public bool HasPermission (string functionKey, Policy policy) {
            var claimedFunction = stateService.Functions.FirstOrDefault (f => f.Key == functionKey);
            return claimedFunction != null && (int) claimedFunction.Policy >= (int) policy;
        }
    }
}
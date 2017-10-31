using MediatR;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.Cryptography;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.MediatRModels;
using System.Threading.Tasks;

namespace RiskControl.Account.Handlers
{
    public class PasswordHandler : IAsyncRequestHandler<PasswordRequest, bool>
    {
        private readonly UserService userService;

        private readonly SecurityService securityService;

        private readonly StateService stateService;

        public PasswordHandler(UserService userService, SecurityService securityService, StateService stateService)
        {
            this.userService = userService;
            this.securityService = securityService;
            this.stateService = stateService;
        }

        public async Task<bool> Handle(PasswordRequest message)
        {
            var newPassword = CryptographyEncoding.CfsEnCode(message.Password);
            var user = await userService.Get(stateService.Username, message.OldPassword).ConfigureAwait(false);
            await securityService.UpdatePassword(user.Id, newPassword).ConfigureAwait(false);
            return true;
        }
    }
}

using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public class Handler : IAsyncRequestHandler<Request, ExecuteResult>
    {
        private readonly ValidationService validationService;

        private readonly UpdateService updateService;

        private readonly StateService stateService;

        public Handler(StateService stateService, ValidationService validationService, UpdateService updateService)
        {
            this.stateService = stateService;
            this.validationService = validationService;
            this.updateService = updateService;
        }

        public async Task<ExecuteResult> Handle(Request message)
        {
            var userContext = new UserContext { UserId = stateService.UserId, IP = stateService.IP };

            var validationResult = validationService.Execute(message);
            if (validationResult > 0)
            {
                return new ExecuteResult(validationResult);
            }

            await updateService.Execute(message, userContext).ConfigureAwait(false);
            return new ExecuteResult();
        }
    }
}
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using System.Threading.Tasks;
using System.Threading;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public class Handler : IRequestHandler<Request, ExecuteResult>
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

        public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
        {
            var userContext = new UserContext { UserId = stateService.UserId, IP = stateService.IP };

            var validationResult = validationService.Execute(request);
            if (validationResult > 0)
            {
                return new ExecuteResult(validationResult);
            }

            await updateService.Execute(request, userContext).ConfigureAwait(false);
            return new ExecuteResult();
        }
    }
}
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    public class Handler : IRequestHandler<Request, ExecuteResult>
    {
        private readonly StateService stateService;

        private readonly ValidationService validationService;

        private readonly InsertService insertService;

        public Handler(StateService stateService, ValidationService validationService, InsertService insertService)
        {
            this.insertService = insertService;
            this.validationService = validationService;
            this.stateService = stateService;
        }

        public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
        {
            var userContext = new UserContext { UserId = stateService.UserId, IP = stateService.IP };

            var validattionResult = await validationService.Execute(request).ConfigureAwait(false);
            if (validattionResult == 0)
            {
                await insertService.Execute(request, userContext).ConfigureAwait(false);
                return new ExecuteResult();
            }
            else
            {
                return new ExecuteResult(validattionResult);
            }
        }
    }
}
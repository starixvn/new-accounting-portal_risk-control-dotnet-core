using System.Threading.Tasks;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    public class Handler : IAsyncRequestHandler<Request, ExecuteResult>
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

        public async Task<ExecuteResult> Handle(Request message)
        {
            var userContext = new UserContext { UserId = stateService.UserId, IP = stateService.IP };

            var validattionResult = await validationService.Execute(message).ConfigureAwait(false);
            if (validattionResult == 0)
            {
                await insertService.Execute(message, userContext).ConfigureAwait(false);
                return new ExecuteResult();
            }
            else
            {
                return new ExecuteResult(validattionResult);
            }
        }
    }
}
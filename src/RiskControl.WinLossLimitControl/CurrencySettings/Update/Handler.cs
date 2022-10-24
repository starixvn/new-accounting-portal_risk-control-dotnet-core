using System.Threading;
using System.Threading.Tasks;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public class Handler : IRequestHandler<Request, ExecuteResult>
    {
        private readonly ValidationService validationService;

        private readonly UpdateService updateService;

        private readonly UserHttpContext userHttpContext;

        public Handler(UserHttpContext userHttpContext, ValidationService validationService, UpdateService updateService)
        {
            this.userHttpContext = userHttpContext;
            this.validationService = validationService;
            this.updateService = updateService;
        }

        public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
        {
            var userContext = new UserContext { UserId = userHttpContext.UserId, IP = userHttpContext.IP };

            var validationResult = validationService.Execute(request);
            if (validationResult > 0)
            {
                return new ExecuteResult(validationResult);
            }

            await updateService.Execute(request, userContext);
            return new ExecuteResult();
        }
    }
}
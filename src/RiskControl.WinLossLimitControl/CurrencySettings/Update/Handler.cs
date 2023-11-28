using System.Threading;
using System.Threading.Tasks;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public class Handler(UserHttpContext userHttpContext, ValidationService validationService, UpdateService updateService)
    : IRequestHandler<Request, ExecuteResult>
{
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
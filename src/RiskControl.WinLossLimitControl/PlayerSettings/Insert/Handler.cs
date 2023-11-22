using System.Threading;
using System.Threading.Tasks;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert;

public class Handler(UserHttpContext userHttpContext, ValidationService validationService, InsertService insertService)
    : IRequestHandler<Request, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
    {
        var userContext = new UserContext { UserId = userHttpContext.UserId, IP = userHttpContext.IP };

        var validattionResult = await validationService.Execute(request);
        if (validattionResult == 0)
        {
            await insertService.Execute(request, userContext);
            return new ExecuteResult();
        }

        return new ExecuteResult(validattionResult);
    }
}
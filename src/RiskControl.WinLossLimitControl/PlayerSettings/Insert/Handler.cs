using System.Threading;
using System.Threading.Tasks;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert;

public class Handler : IRequestHandler<Request, ExecuteResult>
{
    private readonly UserHttpContext userHttpContext;

    private readonly ValidationService validationService;

    private readonly InsertService insertService;

    public Handler(UserHttpContext userHttpContext, ValidationService validationService, InsertService insertService)
    {
        this.insertService = insertService;
        this.validationService = validationService;
        this.userHttpContext = userHttpContext;
    }

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
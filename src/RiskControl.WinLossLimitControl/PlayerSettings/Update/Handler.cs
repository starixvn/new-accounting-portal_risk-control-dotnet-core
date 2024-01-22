using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update;

public class Handler(UserHttpContext userHttpContext, ValidationService validationService,
        IDynamicRepository repository, IMapper mapper)
    : IRequestHandler<Request, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<UpdateCriteria>(request);
        criteria.UserId = userHttpContext.UserId;
        criteria.IP = userHttpContext.IP;
        criteria.MaxWinLimit = request.Limit;

        var valid = await validationService.Execute(request);
        if (!valid)
        {
            return new ExecuteResult(1);
        }

        await repository.ExecuteAsync(criteria);

        return new ExecuteResult();
    }
}
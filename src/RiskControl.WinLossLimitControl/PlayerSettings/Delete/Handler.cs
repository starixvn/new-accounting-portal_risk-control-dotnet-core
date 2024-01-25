using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete;

public class Handler(UserHttpContext userHttpContext, IDynamicRepository repository, IMapper mapper)
    : IRequestHandler<Request, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<DeleteCriteria>(request);
        criteria.UserId = userHttpContext.UserId;
        criteria.IP = userHttpContext.IP;

        await repository.ExecuteAsync(criteria);
        return new ExecuteResult();
    }
}
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete;

public class Handler : IRequestHandler<Request, ExecuteResult>
{
    private readonly UserHttpContext userHttpContext;

    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public Handler(UserHttpContext userHttpContext, IDynamicRepository repository, IMapper  mapper)
    {
        this.userHttpContext = userHttpContext;
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<DeleteCriteria>(request);
        criteria.UserId = userHttpContext.UserId;
        criteria.IP = userHttpContext.IP;

        await repository.ExecuteAsync(criteria, cancellationToken);
        return new ExecuteResult();
    }
}
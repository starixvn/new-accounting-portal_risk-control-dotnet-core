using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;

public class HandlerValidation(IDynamicRepository repository, IMapper mapper) : IRequestHandler<RequestValidation, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(RequestValidation request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<ValidationCriteria>(request);
        return await repository.GetAsync<ExecuteResult>(criteria);
    }
}
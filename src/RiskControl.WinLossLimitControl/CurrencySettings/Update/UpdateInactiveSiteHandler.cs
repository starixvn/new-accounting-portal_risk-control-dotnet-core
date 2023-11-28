using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public class UpdateInactiveSiteHandler(IDynamicRepository repository, IMapper mapper) : IRequestHandler<UpdateInactiveSiteRequest, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(UpdateInactiveSiteRequest request, CancellationToken cancellationToken)
    {
        var criteriaList = mapper.Map<List<UpdateInactiveSiteCriteria>>(request.Settings);
        var executeResults = criteriaList.Select(c => repository.ExecuteAsync(c, cancellationToken)).ToArray();
        await Task.WhenAll(executeResults);
        return new ExecuteResult();
    }
}
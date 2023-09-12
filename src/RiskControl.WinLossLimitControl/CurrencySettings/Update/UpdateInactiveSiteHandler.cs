using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public class UpdateInactiveSiteHandler : IRequestHandler<UpdateInactiveSiteRequest, ExecuteResult>
{
    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public UpdateInactiveSiteHandler(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }
    public async Task<ExecuteResult> Handle(UpdateInactiveSiteRequest request, CancellationToken cancellationToken)
    {
        var criteriaList = mapper.Map<List<UpdateInactiveSiteCriteria>>(request.Settings);
        var executeResults = criteriaList.Select(c => repository.ExecuteAsync(c)).ToArray();
        await Task.WhenAll(executeResults);
        return new ExecuteResult();
    }
}
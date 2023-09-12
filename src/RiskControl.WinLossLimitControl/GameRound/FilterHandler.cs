using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.GameRound;

public class FilterHandler : IRequestHandler<ProductGameTypeRequest, IEnumerable<ProductGameTypeModel>>
{
    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public FilterHandler(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<IEnumerable<ProductGameTypeModel>> Handle(ProductGameTypeRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<ProductGameTypeCriteria>(request);
        return await repository.FetchAsync<ProductGameTypeModel>(criteria);
    }
}
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

public class FilterHandler(IDynamicRepository repository, IMapper mapper) : IRequestHandler<ProductGameTypeRequest, IEnumerable<ProductGameTypeModel>>
{
    public async Task<IEnumerable<ProductGameTypeModel>> Handle(ProductGameTypeRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<ProductGameTypeCriteria>(request);
        return await repository.FetchAsync<ProductGameTypeModel>(criteria, cancellationToken);
    }
}
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking;

public class Handler(DataSourceChooser dataSourceChooser,
        IDynamicRepository repository,
        IMapper mapper)
    : IRequestHandler<QueryModel, IEnumerable<HousePositionTakingModel>>
{
    public Task<IEnumerable<HousePositionTakingModel>> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<Criteria>(request);
        criteria.Source = dataSourceChooser.GetDataSource(criteria.IsNormalMode);
        return repository.FetchAsync<HousePositionTakingModel>(criteria, cancellationToken);
    }
}
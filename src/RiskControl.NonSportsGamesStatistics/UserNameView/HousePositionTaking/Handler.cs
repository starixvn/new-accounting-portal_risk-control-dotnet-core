using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking
{
    public class Handler : IRequestHandler<QueryModel, IEnumerable<HousePositionTakingModel>>
    {
        private readonly DataSourceChooser dataSourceChooser;
        private readonly IDynamicRepository repository;
        private readonly IMapper mapper;

        public Handler(
            DataSourceChooser dataSourceChooser,
            IDynamicRepository repository,
            IMapper mapper)
        {
            this.dataSourceChooser = dataSourceChooser;
            this.repository = repository;
            this.mapper = mapper;
        }

        public Task<IEnumerable<HousePositionTakingModel>> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<Criteria>(request);
            criteria.Source = dataSourceChooser.GetDataSource(criteria.IsNormalMode);
            return repository.FetchAsync<HousePositionTakingModel>(criteria);
        }
    }
}
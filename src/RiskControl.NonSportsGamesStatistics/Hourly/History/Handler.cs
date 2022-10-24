using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History
{
    public class Handler : IRequestHandler<QueryModel, HourlyReportModel>
    {
        private readonly Service service;
        private readonly IMapper mapper;

        public Handler(Service service, IMapper mapper)
        {
            this.service = service;
            this.mapper = mapper;
        }

        public async Task<HourlyReportModel> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<Criteria>(request);
            return await service.CalculateHourlyReport(criteria, criteria.FromDate).ConfigureAwait(false);
        }
    }
}
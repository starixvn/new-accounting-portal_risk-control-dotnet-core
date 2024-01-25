using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History;

public class Handler(Service service, IMapper mapper) : IRequestHandler<QueryModel, HourlyReportModel>
{
    public Task<HourlyReportModel> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<Criteria>(request);
        return service.CalculateHourlyReport(criteria, criteria.FromDate);
    }
}
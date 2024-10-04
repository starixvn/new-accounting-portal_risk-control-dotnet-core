using AutoMapper;
using Fanex.Excel.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline.Main;

public class Handler(Service service, IMapper mapper) : IRequestHandler<Request, GridOptions>
{
    public async Task<GridOptions> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<Criteria>(request);
        var data = await service.QueryData(criteria);
        var gridOptions = service.BuildGridOpions(data, request);
        return gridOptions;
    }
}
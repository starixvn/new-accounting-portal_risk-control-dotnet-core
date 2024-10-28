using AutoMapper;
using Fanex.Excel.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline.Main;

public class Handler(Service service, IMapper mapper) : BaseHandler<Request>(service, mapper), IRequestHandler<Request, GridOptions>
{
    public async Task<GridOptions> Handle(Request request, CancellationToken cancellationToken)
    {
        if (request.IsToDay)
        {
            return await base.Handle<NormalCriteria>(request, false);
        }
        return await base.Handle<Criteria>(request, false);
    }
}
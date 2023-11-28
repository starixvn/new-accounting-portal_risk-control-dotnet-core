using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Excel.Models;
using MediatR;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.Normal;

public class Handler(Service service,
        GridOptionBuilderService gridOptionService,
        IMapper mapper)
    : IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<Criteria>(request);

        var reportModel = await service.Query(criteria, criteria.WinLostDate).ConfigureAwait(false);

        var gridOptions = gridOptionService.BuildGridOptions(reportModel, request, request.DrillDownCurrency);

        return gridOptions;
    }
}
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly;

public class Handler : BaseHandlerWithSorting<QueryModel, HistoryCriteria, DailyViewReportModel>, IRequestHandler<QueryModel, GridOptions>
{
    public Handler(
        Service<DailyViewReportModel, HistoryCriteria> service,
        SortingService<DailyViewReportModel> sortingService,
        GridOptionBuilderService<DailyViewReportModel, QueryModel> gridOptionService) : base(service, sortingService, gridOptionService)
    {
    }

    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.FromDate).ConfigureAwait(false);
    }
}
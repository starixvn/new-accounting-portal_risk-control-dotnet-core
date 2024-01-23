using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily.Normal;

public class Handler(Service<DailyReportModel, Criteria> service,
        SortingService<DailyReportModel> sortingService,
        GridOptionBuilderService<DailyReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithSorting<QueryModel, Criteria, DailyReportModel>(service, sortingService, gridOptionService),
        IRequestHandler<QueryModel, GridOptions>
{
    public Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return base.Handle(request, request.WinLostDate);
    }
}
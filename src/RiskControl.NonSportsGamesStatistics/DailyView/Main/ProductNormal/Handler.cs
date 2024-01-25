using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main.ProductNormal;

public class Handler(Service<DailyViewReportModel, Criteria> service,
        SortingService<DailyViewReportModel> sortingService,
        GridOptionBuilderService<DailyViewReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithSorting<QueryModel, Criteria, DailyViewReportModel>(service, sortingService, gridOptionService),
        IRequestHandler<QueryModel, GridOptions>
{
    public Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return base.Handle(request, request.WinLostDate);
    }
}
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.Company;

public class Handler(Service<DailyViewGroupStatisticWithTotalReportModel, Criteria> service,
        SortingService<DailyViewGroupStatisticWithTotalReportModel> sortingService,
        GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithSorting<QueryModel, Criteria, DailyViewGroupStatisticWithTotalReportModel>(service, sortingService,
        gridOptionService), IRequestHandler<QueryModel, GridOptions>
{
    public Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return base.Handle(request, request.FromDate);
    }
}
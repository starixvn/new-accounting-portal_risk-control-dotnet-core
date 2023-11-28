using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.DeviceNormal;

public class Handler(Service<DailyViewGroupStatisticWithTotalReportModel, Criteria> service,
        SortingService<DailyViewGroupStatisticWithTotalReportModel> sortingService,
        GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithSorting<QueryModel, Criteria, DailyViewGroupStatisticWithTotalReportModel>(service, sortingService,
        gridOptionService), IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
    }
}
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyViewGrandTotalNormal;

public class Handler(Service<CurrencyViewStatisticsReportModel, Criteria> service,
        GridOptionBuilderService<CurrencyViewStatisticsReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithoutSorting<QueryModel, Criteria, CurrencyViewStatisticsReportModel>(service, gridOptionService),
        IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
    }
}
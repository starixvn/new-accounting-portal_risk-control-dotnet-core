using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyViewGrandTotalHistory
{
    public class Handler : BaseHandlerWithoutSorting<QueryModel, Criteria, CurrencyViewStatisticsReportModel>, IRequestHandler<QueryModel, GridOptions>
    {
        public Handler(
            Service<CurrencyViewStatisticsReportModel> service,
            GridOptionBuilderService<CurrencyViewStatisticsReportModel> gridOptionService) : base(service, gridOptionService)
        {
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            return await base.Handle(request, request.FromDate).ConfigureAwait(false);
        }
    }
}
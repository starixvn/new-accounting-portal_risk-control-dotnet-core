using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily.History
{
    public class Handler : BaseHandlerWithSorting<QueryModel, Criteria, DailyReportModel>, IRequestHandler<QueryModel, GridOptions>
    {
        public Handler(
            Service<DailyReportModel, Criteria> service,
            SortingService<DailyReportModel> sortingService,
            GridOptionBuilderService<DailyReportModel, QueryModel> gridOptionService) : base(service, sortingService, gridOptionService)
        {
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            return await base.Handle(request, request.FromDate).ConfigureAwait(false);
        }
    }
}
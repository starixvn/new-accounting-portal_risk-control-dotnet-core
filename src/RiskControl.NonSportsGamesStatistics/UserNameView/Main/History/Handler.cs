using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.History
{
    public class Handler : BaseHandlerWithSorting<QueryModel, Criteria, UserNameViewReportModel>, IRequestHandler<QueryModel, GridOptions>
    {
        public Handler(
            Service<UserNameViewReportModel> service,
            SortingService<UserNameViewReportModel> sortingService,
            GridOptionBuilderService<UserNameViewReportModel> gridOptionService) : base(service, sortingService, gridOptionService)
        {
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            return await base.Handle(request, request.FromDate).ConfigureAwait(false);
        }
    }
}
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.Normal
{
    public class Handler : BaseHandlerWithoutSorting<QueryModel, Criteria, UserNameViewReportModel>, IRequestHandler<QueryModel, GridOptions>
    {
        public Handler(
            Service<UserNameViewReportModel, Criteria> service,
            GridOptionBuilderService<UserNameViewReportModel, QueryModel> gridOptionService) : base(service, gridOptionService)
        {
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
        }
    }
}
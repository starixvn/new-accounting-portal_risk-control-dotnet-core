using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount
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
            return await base.Handle(request, request.ToDate).ConfigureAwait(false);
        }
    }
}
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount
{
    public class Handler : BaseHandlerWithoutSorting<QueryModel, UsernameHistoryCriteria, UserNameViewReportModel>, IRequestHandler<QueryModel, GridOptions>
    {
        public Handler(
            Service<UserNameViewReportModel> service,
            GridOptionBuilderService<UserNameViewReportModel> gridOptionService) : base(service, gridOptionService)
        {
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            return await base.Handle(request, request.ToDate).ConfigureAwait(false);
        }
    }
}
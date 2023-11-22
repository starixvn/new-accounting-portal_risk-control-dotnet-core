using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.Normal;

public class Handler(Service<UserNameViewReportModel, Criteria> service,
        GridOptionBuilderService<UserNameViewReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithoutSorting<QueryModel, Criteria, UserNameViewReportModel>(service, gridOptionService),
        IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
    }
}
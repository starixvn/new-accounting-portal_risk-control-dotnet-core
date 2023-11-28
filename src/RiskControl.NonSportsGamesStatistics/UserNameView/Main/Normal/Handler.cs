using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal;

public class Handler(Service<UserNameViewReportModel, Criteria> service,
        SortingService<UserNameViewReportModel> sortingService,
        GridOptionBuilderService<UserNameViewReportModel, QueryModel> gridOptionService)
    : BaseHandlerWithSorting<QueryModel, Criteria, UserNameViewReportModel>(service, sortingService, gridOptionService),
        IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
    }
}
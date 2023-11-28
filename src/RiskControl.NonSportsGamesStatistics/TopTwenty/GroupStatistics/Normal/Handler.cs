using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.Normal;

public class Handler(Service<UserNameViewGroupStatisticsWithTotalModel, Criteria> service,
        GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, QueryModel> gridOptionService)
    : BaseHandlerWithoutSorting<QueryModel, Criteria, UserNameViewGroupStatisticsWithTotalModel>(service,
        gridOptionService), IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
    }
}
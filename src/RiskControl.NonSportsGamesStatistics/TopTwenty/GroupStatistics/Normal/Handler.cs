using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.Normal;

public class Handler : BaseHandlerWithoutSorting<QueryModel, Criteria, UserNameViewGroupStatisticsWithTotalModel>, IRequestHandler<QueryModel, GridOptions>
{
    public Handler(
        Service<UserNameViewGroupStatisticsWithTotalModel, Criteria> service,
        GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, QueryModel> gridOptionService) : base(service, gridOptionService)
    {
    }

    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.WinLostDate).ConfigureAwait(false);
    }
}
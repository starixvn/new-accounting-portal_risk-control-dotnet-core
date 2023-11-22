using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main.History;

public class Handler(Service<List<UserNameViewGroupStatisticsWithTotalModel>, Criteria> service,
        GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, QueryModel> gridOptionService)
    : BaseHandlerWithoutSorting<QueryModel, Criteria, List<UserNameViewGroupStatisticsWithTotalModel>>(service,
        gridOptionService), IRequestHandler<QueryModel, GridOptions>
{
    public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return await base.Handle(request, request.FromDate).ConfigureAwait(false);
    }
}
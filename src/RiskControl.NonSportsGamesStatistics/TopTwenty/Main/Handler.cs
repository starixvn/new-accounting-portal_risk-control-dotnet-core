using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main;

public class Handler(Service<List<UserNameViewGroupStatisticsWithTotalModel>, Criteria> service,
        GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, QueryModel> gridOptionService)
    : BaseHandlerWithoutSorting<QueryModel, Criteria, List<UserNameViewGroupStatisticsWithTotalModel>>(service,
        gridOptionService), IRequestHandler<QueryModel, GridOptions>
{
    public Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
    {
        return base.Handle(request, request.FromDate);
    }
}
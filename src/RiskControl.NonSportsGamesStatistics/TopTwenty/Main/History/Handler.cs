using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main.History
{
    public class Handler : BaseHandlerWithoutSorting<QueryModel, Criteria, List<UserNameViewGroupStatisticsWithTotalModel>>, IRequestHandler<QueryModel, GridOptions>
    {
        public Handler(
            Service<List<UserNameViewGroupStatisticsWithTotalModel>> service,
            GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>> gridOptionService) : base(service, gridOptionService)
        {
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            return await base.Handle(request, request.FromDate).ConfigureAwait(false);
        }
    }
}
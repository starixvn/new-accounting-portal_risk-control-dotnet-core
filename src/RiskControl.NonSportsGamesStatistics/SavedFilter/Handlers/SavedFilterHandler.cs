using MediatR;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Model;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Requests;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Services;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.SavedFilter.Handlers;

public class SavedFilterHandler(SavedFilterService service): IRequestHandler<SavedFilterRequest, IEnumerable<SavedFilterModel>>,
    IRequestHandler<ExecuteFilterRequest, int>
{
    public Task<IEnumerable<SavedFilterModel>>
        Handle(SavedFilterRequest request, CancellationToken cancellationToken) => service.GetFilters(request);

    public Task<int> Handle(ExecuteFilterRequest request, CancellationToken cancellationToken) =>
        service.ExecuteFilter(request);
}
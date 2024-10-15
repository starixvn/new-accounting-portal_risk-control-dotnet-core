using Fanex.Data.Repository;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Criteria;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Model;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Requests;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;

namespace RiskControl.NonSportsGamesStatistics.SavedFilter.Services;

using Fanex.NAP.Client;

public interface SavedFilterService
{
    Task<IEnumerable<SavedFilterModel>> GetFilters(SavedFilterRequest request);

    Task<int> ExecuteFilter(ExecuteFilterRequest request);
}

public class SavedFilterServiceImp(IDynamicRepository repository, IMapper mapper, INapSession sessionService) : SavedFilterService
{
    public Task<IEnumerable<SavedFilterModel>> GetFilters(SavedFilterRequest request)
    {
        var criteria = mapper.Map<SavedFilterCriteria>(request);
        criteria.UserId = sessionService.UserId;
        return repository.FetchAsync<SavedFilterModel>(criteria);
    }

    public Task<int> ExecuteFilter(ExecuteFilterRequest request)
    {
        var criteria = mapper.Map<SavedFilterCriteria>(request);
        criteria.UserId = sessionService.UserId;
        return repository.ExecuteAsync(criteria);
    }
}
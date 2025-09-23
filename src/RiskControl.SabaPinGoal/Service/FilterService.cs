using Fanex.Data.Repository;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface FilterService
{
    Task<IEnumerable<CompanyModel>> GetCompanies();

    Task<IEnumerable<SportModel>> GetSports();

    Task<IEnumerable<LeagueGroupModel>> GetLeagueGroups();
}

public class FilterServiceImp(IDynamicRepository repository) : FilterService
{
    public Task<IEnumerable<CompanyModel>> GetCompanies()
    {
        return repository.FetchAsync<CompanyModel>(new CompanyCriteria());
    }

    public Task<IEnumerable<SportModel>> GetSports()
    {
        return repository.FetchAsync<SportModel>(new SportCriteria());
    }

    public Task<IEnumerable<LeagueGroupModel>> GetLeagueGroups()
    {
        return repository.FetchAsync<LeagueGroupModel>(new LeagueGroupCriteria());
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Filter;

public interface FilterService
{
    Task<IEnumerable<BaseEntity>> GetCurrencies(GetCurrencyCriteria criteria);

    IEnumerable<BaseEntity> GetProducts();

    Task<IEnumerable<SiteGroup>> GetSiteByProduct(GetSiteCriteria criteria);

    Task<IEnumerable<Customer>> SearchUsers(CustomerSuggestionCriteria criteria);

    Task<IEnumerable<Group>> GetGroupByProduct(GetGroupCriteria criteria);
}

public class FilterServiceImp(IDynamicRepository repository, CacheRefService cacheRefService)
    : FilterService
{
    public async Task<IEnumerable<BaseEntity>> GetCurrencies(GetCurrencyCriteria criteria)
    {
        return await repository.FetchAsync<BaseEntity>(criteria);
    }

    public async Task<IEnumerable<Group>> GetGroupByProduct(GetGroupCriteria criteria)
    {
        return await repository.FetchAsync<Group>(criteria);
    }

    public IEnumerable<BaseEntity> GetProducts()
    {
        return cacheRefService
            .BaseEntityGroup
            .Products
            .Select(e => new BaseEntity
            {
                Id = e.Key,
                Name = e.Value
            });
    }

    public async Task<IEnumerable<SiteGroup>> GetSiteByProduct(GetSiteCriteria criteria)
    {
        var rawData = await repository.FetchAsync<Site>(criteria);
        var groups = rawData.GroupBy(x => x.GroupName).ToList();

        return groups.Select(group => new SiteGroup
        {
            GroupName = group.Key,
            Sites = group.ToList()
        });
    }

    public async Task<IEnumerable<Customer>> SearchUsers(CustomerSuggestionCriteria criteria)
    {
        return await repository.FetchAsync<Customer>(criteria);
    }
}
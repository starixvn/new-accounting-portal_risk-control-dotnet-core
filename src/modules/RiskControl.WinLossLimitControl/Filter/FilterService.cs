using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Filter
{
    public interface FilterService
    {
        Task<IEnumerable<BaseEntity>> GetCurrencies(GetCurrencyCriteria criteria);

        IEnumerable<BaseEntity> GetProducts();

        Task<IEnumerable<SiteGroup>> GetSiteByProduct(GetSiteCriteria criteria);

        Task<IEnumerable<Customer>> SearchUsers(CustomerSuggestionCriteria criteria);
    }

    public class FilterServiceImp : FilterService
    {
        private readonly CacheRefService cacheRefService;
        private readonly IDynamicRepository repository;

        public FilterServiceImp(IDynamicRepository repository, CacheRefService cacheRefService)
        {
            this.repository = repository;
            this.cacheRefService = cacheRefService;
        }

        public async Task<IEnumerable<BaseEntity>> GetCurrencies(GetCurrencyCriteria criteria)
        {
            return await repository.FetchAsync<BaseEntity>(criteria).ConfigureAwait(false);
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
            var rawData = await repository.FetchAsync<Site>(criteria).ConfigureAwait(false);
            var groups = rawData.GroupBy(x => x.GroupName).ToList();

            return groups.Select(group => new SiteGroup
            {
                GroupName = group.Key,
                Sites = group.ToList()
            });
        }

        public async Task<IEnumerable<Customer>> SearchUsers(CustomerSuggestionCriteria criteria)
        {
            return await repository.FetchAsync<Customer>(criteria).ConfigureAwait(false);
        }
    }
}
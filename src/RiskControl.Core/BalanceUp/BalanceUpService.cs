using Fanex.Caching;
using Fanex.Data.Repository;

namespace RiskControl.Core.BalanceUp
{
    public interface BalanceUpService
    {
        BalanceUpRange Query();
    }

    public class BalanceUpServiceImp : BalanceUpService
    {
        private const string BalanceUpRangeCacheKey = "BalanceUpRangeCacheKey";

        private readonly IDynamicRepository repository;

        private readonly ICacheService cacheService;

        public BalanceUpServiceImp(IDynamicRepository repository, ICacheService cacheService)
        {
            this.repository = repository;
            this.cacheService = cacheService;
        }

        public BalanceUpRange Query()
        {
            return QueryFromSource();
        }

        private BalanceUpRange QueryFromSource()
        {
            var criteria = new Criteria();
            return repository.Get<BalanceUpRange>(criteria);
        }
    }
}
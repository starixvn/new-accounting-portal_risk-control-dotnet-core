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

        private readonly CacheService cacheService;

        public BalanceUpServiceImp(IDynamicRepository repository, CacheService cacheService)
        {
            this.repository = repository;
            this.cacheService = cacheService;
        }

        public BalanceUpRange Query()
        {
            return cacheService.GetOrSet(
                BalanceUpRangeCacheKey,
                QueryFromSource);
        }

        private BalanceUpRange QueryFromSource()
        {
            var criteria = new Criteria();
            return repository.Get<BalanceUpRange>(criteria);
        }
    }
}
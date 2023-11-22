namespace RiskControl.BalanceUp;

using Fanex.Caching;
using Fanex.Data.Repository;

public interface BalanceUpService
{
    BalanceUpRange Query();
}

public class BalanceUpServiceImp(IDynamicRepository repository, ICacheService cacheService) : BalanceUpService
{
    private const string BalanceUpRangeCacheKey = "BalanceUpRangeCacheKey";

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
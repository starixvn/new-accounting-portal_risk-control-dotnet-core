using System;
using Fanex.Caching;
using Fanex.RemotingRef;
using RiskControl.WinLossLimitControl.Filter.Model;

namespace RiskControl.WinLossLimitControl.Filter;

public interface CacheRefService
{
    BaseEntityGroup BaseEntityGroup { get; }

    string GetProductName(int productId);

    string GetCurrencyName(int currencyId);

    string GetGroupName(int groupId);

    string GetSiteName(int siteId);

    string GetBetTypeName(int betTypeId);

    string GetSportName(int sportId);
}

public class CacheRefServiceImp : CacheRefService
{
    private const int CacheDurationInMinutes = 15;
    private const string CacheKey = "RiskControl.Settings.BaseEntityGroup";

    private readonly BaseEntityGroupLoaderService baseEntityGroupLoaderService;

    private readonly ICacheService cacheService;

    private readonly IRemotingRefService remotingRefService;

    public CacheRefServiceImp(BaseEntityGroupLoaderService baseEntityGroupLoaderService, ICacheService cacheService, IRemotingRefService remotingRefService)
    {
        this.baseEntityGroupLoaderService = baseEntityGroupLoaderService;
        this.cacheService = cacheService;
        this.remotingRefService = remotingRefService;
    }

    public BaseEntityGroup BaseEntityGroup
    {
        get
        {
            ReloadCacheDataIfExpired();
            return cacheService.Get<BaseEntityGroup>(CacheKey);
        }
    }

    private void ReloadCacheDataIfExpired()
    {
        if (cacheService.Get<BaseEntityGroup>(CacheKey) == null)
        {
            ReloadCacheData();
        }
    }

    private void ReloadCacheData()
    {
        var cacheExpiration = DateTime.Now.AddMinutes(CacheDurationInMinutes);
        var baseEntityGroup = baseEntityGroupLoaderService.GetBaseEntityGroup();
        cacheService.Set(CacheKey, baseEntityGroup, new CacheItemOptions { AbsoluteExpiration = cacheExpiration });
    }

    public string GetProductName(int productId)
    {
        return BaseEntityGroup.Products.TryGetValue(productId, out var product)
            ? product
            : $"Product {productId} does not exist";
    }

    public string GetCurrencyName(int currencyId)
    {
        return BaseEntityGroup.Currencies.TryGetValue(currencyId, out var currency)
            ? currency
            : $"Currency {currencyId} does not exist";
    }

    public string GetGroupName(int groupId)
    {
        return BaseEntityGroup.Groups.TryGetValue(groupId, out var group)
            ? group
            : $"Group {groupId} does not exist";
    }

    public string GetSiteName(int siteId)
    {
        return BaseEntityGroup.Sites.TryGetValue(siteId, out var site)
            ? site
            : $"Site {siteId} does not exist";
    }

    public string GetBetTypeName(int betTypeId)
    {
        return remotingRefService.GetBetTypeName(betTypeId.ToString(), "en-US");
    }

    public string GetSportName(int sportId)
    {
        return remotingRefService.GetSportName(sportId.ToString(), "en-US");
    }
}
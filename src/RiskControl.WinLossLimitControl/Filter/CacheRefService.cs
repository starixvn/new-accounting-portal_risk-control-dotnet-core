using System;
using Fanex.Caching;
using Fanex.RemotingRef;
using RiskControl.WinLossLimitControl.Filter.Model;

namespace RiskControl.WinLossLimitControl.Filter;

using System.Collections.Generic;

public interface CacheRefService
{
    BaseEntityGroup BaseEntityGroup { get; }

    string GetProductName(int productId);

    string GetCurrencyName(int currencyId);

    string GetGroupName(int groupId);

    string GetSiteName(int siteId);

    string GetBetTypeName(int betTypeId);

    string GetSportName(int sportId);

    void ReloadCache(List<int> sportIds, List<int> betTypeIds);
}

public class CacheRefServiceImp(BaseEntityGroupLoaderService baseEntityGroupLoaderService, ICacheService cacheService,
        IRemotingRefService remotingRefService)
    : CacheRefService
{
    private const int CacheDurationInMinutes = 15;
    private const string CacheKey = "RiskControl.Settings.BaseEntityGroup";

    private readonly Dictionary<int, string> sportNames = new();

    private readonly Dictionary<int, string> betTypeNames = new();

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
        if(betTypeNames.TryGetValue(betTypeId, out var name))
        {
            return name;
        }

        return remotingRefService.GetBetTypeName(betTypeId.ToString(), "en-US");
    }

    public string GetSportName(int sportId)
    {
        if (sportNames.TryGetValue(sportId, out var name))
        {
            return name;
        }

        return remotingRefService.GetSportName(sportId.ToString(), "en-US");
    }

    public void ReloadCache(List<int> sportIds, List<int> betTypeIds)
    {
        foreach (var id in sportIds)
        {
            sportNames[id] = GetSportNameeFromRemotingRef(id);
        }

        foreach (var id in betTypeIds)
        {
            betTypeNames[id] = GetBetTypeNameFromRemotingRef(id);
        }
    }

    private string GetBetTypeNameFromRemotingRef(int betTypeId)
    {
        return remotingRefService.GetBetTypeName(betTypeId.ToString(), "en-US");
    }

    private string GetSportNameeFromRemotingRef(int sportId)
    {
        return remotingRefService.GetSportName(sportId.ToString(), "en-US");
    }
}
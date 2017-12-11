using System;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.WebApiClient;
using RiskControl.WinLossLimitControl.Configurations;
using RiskControl.WinLossLimitControl.Filter.Model;

namespace RiskControl.WinLossLimitControl.Filter {
    public interface CacheRefService {
        BaseEntityGroup BaseEntityGroup { get; }

        string GetProductName (int productId);

        string GetCurrencyName (int currencyId);

        string GetGroupName (int groupId);

        string GetSiteName (int siteId);

        string GetBetTypeName (int betTypeId);
    }

    public class CacheRefServiceImp : CacheRefService {
        private const int CacheDurationInMinutes = 15;
        private const string CacheKey = "RiskControl.Settings.BaseEntityGroup";

        private readonly BaseEntityGroupLoaderService baseEntityGroupLoaderService;

        private readonly IMemoryCache memoryCache;

        private readonly RichHttpClient richHttpClient;

        private readonly IOptions<WinLossLimitControlOptions> winLossLimitControlOptions;

        public CacheRefServiceImp (
            BaseEntityGroupLoaderService baseEntityGroupLoaderService,
            IMemoryCache memoryCache,
            RichHttpClient richHttpClient,
            IOptions<WinLossLimitControlOptions> winLossLimitControlOptions) {
            this.baseEntityGroupLoaderService = baseEntityGroupLoaderService;
            this.memoryCache = memoryCache;
            this.richHttpClient = richHttpClient;
            this.winLossLimitControlOptions = winLossLimitControlOptions;
        }

        public BaseEntityGroup BaseEntityGroup {
            get {
                return memoryCache.GetOrCreate<BaseEntityGroup> (CacheKey, cache => {
                    cache.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes (CacheDurationInMinutes);
                    return baseEntityGroupLoaderService.GetBaseEntityGroup ();
                });
            }
        }

        public string GetProductName (int productId) {
            return BaseEntityGroup.Products.ContainsKey (productId) ?
                BaseEntityGroup.Products[productId] :
                $"Product {productId} does not exist";
        }

        public string GetCurrencyName (int currencyId) {
            return BaseEntityGroup.Currencies.ContainsKey (currencyId) ?
                BaseEntityGroup.Currencies[currencyId] :
                $"Currency {currencyId} does not exist";
        }

        public string GetGroupName (int groupId) {
            return BaseEntityGroup.Groups.ContainsKey (groupId) ?
                BaseEntityGroup.Groups[groupId] :
                $"Group {groupId} does not exist";
        }

        public string GetSiteName (int siteId) {
            return BaseEntityGroup.Sites.ContainsKey (siteId) ?
                BaseEntityGroup.Sites[siteId] :
                $"Site {siteId} does not exist";
        }

        public string GetBetTypeName (int betTypeId) {
            var url = $"{winLossLimitControlOptions.Value.LegacyWebApi}/api/RemotingRef/BetType/{betTypeId}";
            return richHttpClient.Get<string> (url).Result;
        }
    }
}
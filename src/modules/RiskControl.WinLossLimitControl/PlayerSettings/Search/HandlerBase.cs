using System.Collections.Generic;
using System.Linq;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search
{
    public class HandlerBase
    {
        private readonly CacheRefService cacheRefService;

        private readonly DataTransformService dataTransformService;

        public HandlerBase(CacheRefService cacheRefService, DataTransformService dataTransformService)
        {
            this.cacheRefService = cacheRefService;
            this.dataTransformService = dataTransformService;
        }

        protected IEnumerable<PlayerSetting> FromRawPlayerSetting(IEnumerable<PlayerSettingRaw> settings)
        {
            var groups = settings.GroupBy(x => new
            {
                x.ProductId,
                x.GroupId,
                x.CurrencyId,
                x.SiteId,
                x.Username,
                x.CustId,
                x.HasCurrencySetting
            });

            foreach (var group in groups)
            {
                var playerSetting = new PlayerSetting
                {
                    CustId = group.Key.CustId,
                    Username = group.Key.Username,
                    ProductId = group.Key.ProductId,
                    ProductName = cacheRefService.GetProductName(group.Key.ProductId),
                    GroupId = group.Key.GroupId,
                    GroupName = cacheRefService.GetGroupName(group.Key.GroupId),
                    CurrencyId = group.Key.CurrencyId,
                    CurrencyName = cacheRefService.GetCurrencyName(group.Key.CurrencyId),
                    SiteId = group.Key.SiteId,
                    SiteName = cacheRefService.GetSiteName(group.Key.SiteId),
                    HasCurrencySetting = group.Key.HasCurrencySetting
                };

                dataTransformService.UpdateFromRaw(playerSetting, group.ToList<WinLossLimitRaw>());

                yield return playerSetting;
            }
        }

        protected IEnumerable<PlayerSettingCurrency> GetPlayerSettingCurrencies(IEnumerable<PlayerSetting> settings)
        {
            return settings.GroupBy(s => new { s.CustId, s.Username, s.SiteId, s.SiteName, s.CurrencyId, s.CurrencyName })
                                 .Select(g => new PlayerSettingCurrency
                                 {
                                     Username = g.Key.Username,
                                     SiteName = g.Key.SiteName,
                                     CurrencyName = g.Key.CurrencyName,
                                     Products = GetPlayerSettingProducts(g.ToList(), g.Key.CustId, g.Key.SiteId, g.Key.CurrencyId)
                                 })
                                 .OrderBy(g => g.Username);
        }

        protected List<PlayerSettingProduct> GetPlayerSettingProducts(List<PlayerSetting> settings, int custId, int siteId, int currencyId)
        {
            var filterSettings = settings.Where(s => s.CustId == custId && s.SiteId == siteId && s.CurrencyId == currencyId);
            return filterSettings.GroupBy(s => new { s.ProductId, s.ProductName })
                                 .Select(g => new PlayerSettingProduct
                                 {
                                     ProductName = g.Key.ProductName,
                                     PlayerSettings = GetPlayerSettings(g.ToList(), custId, siteId, currencyId, g.Key.ProductId)
                                 })
                                 .OrderBy(g => g.ProductName)
                                 .ToList();
        }

        protected static List<PlayerSetting> GetPlayerSettings(List<PlayerSetting> settings, int custId, int siteId, int currencyId, int productId)
        {
            return settings.Where(s => s.CustId == custId && s.SiteId == siteId && s.CurrencyId == currencyId && s.ProductId == productId)
                           .OrderBy(g => g.GroupName)
                           .ToList();
        }
    }
}
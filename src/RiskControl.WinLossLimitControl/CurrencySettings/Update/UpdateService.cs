using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.Extensions;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public interface UpdateService
    {
        Task Execute(List<CurrencySetting> currencySettings, UserContext userContext);
    }

    public class UpdateServiceImp : UpdateService
    {
        private readonly IDynamicRepository repository;

        public UpdateServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task Execute(List<CurrencySetting> currencySettings, UserContext userContext)
        {
            var criteriaList = GetUpdateCurrencyWinLimitCriteria(currencySettings, userContext);
            var executeResults = criteriaList.Select(c => repository.ExecuteAsync(c)).ToArray();

            await Task.WhenAll(executeResults);
        }

        private IEnumerable<UpdateCriteria> GetUpdateCurrencyWinLimitCriteria(IEnumerable<CurrencySetting> currencySettings, UserContext userContext)
        {
            var itemsPerBatch = int.Parse(ConfigurationManager.AppSettings["ItemsPerBatch"]);
            var list = currencySettings.Select(c => GetUpdateCurrencyWinLimitAllLevel(c))
                                   .SelectMany(c => c);
            var criteriaList = new List<UpdateCriteria>();
            for (int i = 0; i < list.Count(); i += itemsPerBatch)
            {
                var models = list.Skip(i).Take(itemsPerBatch);
                var criteria = new UpdateCriteria
                {
                    Xml = models.ToCurrencySettingXml(),
                    UserId = userContext.UserId,
                    IP = userContext.IP
                };
                criteriaList.Add(criteria);
            }
            return criteriaList;
        }

        private IEnumerable<UpdateSiteModel> GetUpdateCurrencyWinLimitAllLevel(CurrencySetting currencySetting)
        {
            yield return GetUpdateCurrencyBlackLevel(currencySetting);
            yield return GetUpdateCurrencyGreyLevel(currencySetting);
            yield return GetUpdateCurrencyOrangeLevel(currencySetting);
            yield return GetUpdateCurrencyYellowLevel(currencySetting);
            yield return GetUpdateCurrencyRedLevel(currencySetting);
        }

        private UpdateSiteModel GetUpdateCurrencyBlackLevel(CurrencySetting currencySetting)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
            defaultLevel.LevelId = LimitLevelConstant.BlackLevel;
            defaultLevel.MaxWinLimit = currencySetting.BlackLimit;

            return defaultLevel;
        }

        private UpdateSiteModel GetUpdateCurrencyGreyLevel(CurrencySetting currencySetting)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
            defaultLevel.LevelId = LimitLevelConstant.GreyLevel;
            defaultLevel.MaxWinLimit = currencySetting.GreyLimit;

            return defaultLevel;
        }

        private UpdateSiteModel GetUpdateCurrencyOrangeLevel(CurrencySetting currencySetting)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
            defaultLevel.LevelId = LimitLevelConstant.OrangeLevel;
            defaultLevel.MaxWinLimit = currencySetting.OrangeLimit;

            return defaultLevel;
        }

        private UpdateSiteModel GetUpdateCurrencyYellowLevel(CurrencySetting currencySetting)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
            defaultLevel.LevelId = LimitLevelConstant.YellowLevel;
            defaultLevel.MaxWinLimit = currencySetting.YellowLimit;

            return defaultLevel;
        }

        private UpdateSiteModel GetUpdateCurrencyRedLevel(CurrencySetting currencySetting)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
            defaultLevel.LevelId = LimitLevelConstant.RedLevel;
            defaultLevel.MaxWinLimit = currencySetting.RedLimit;

            return defaultLevel;
        }

        private UpdateSiteModel GetUpdateCurrencyDefaultLevel(CurrencySetting currencySetting)
        {
            return new UpdateSiteModel
            {
                ProductId = currencySetting.ProductId,
                GroupId = currencySetting.GroupId,
                CurrencyId = currencySetting.CurrencyId,
                SiteId = currencySetting.SiteId,
                IsBlockedPlaceBet = currencySetting.IsBlockedPlacebetRedLevel,
                IsBlockedTransfer = currencySetting.IsBlockedTransferRedLevel
            };
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
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

            await Task.WhenAll(executeResults).ConfigureAwait(false);
        }

        private IEnumerable<UpdateCriteria> GetUpdateCurrencyWinLimitCriteria(IEnumerable<CurrencySetting> currencySettings, UserContext userContext)
        {
            return currencySettings.Select(c => GetUpdateCurrencyWinLimitAllLevelCriteria(c, userContext))
                                   .SelectMany(c => c);
        }

        private IEnumerable<UpdateCriteria> GetUpdateCurrencyWinLimitAllLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            yield return GetUpdateCurrencyBlackLevelCriteria(currencySetting, userContext);
            yield return GetUpdateCurrencyGreyLevelCriteria(currencySetting, userContext);
            yield return GetUpdateCurrencyOrangeLevelCriteria(currencySetting, userContext);
            yield return GetUpdateCurrencyYellowLevelCriteria(currencySetting, userContext);
            yield return GetUpdateCurrencyRedLevelCriteria(currencySetting, userContext);
        }

        private UpdateCriteria GetUpdateCurrencyBlackLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevelCriteria(currencySetting, userContext);
            defaultLevel.LevelId = LimitLevelConstant.BlackLevel;
            defaultLevel.MaxWinLimit = currencySetting.BlackLimit;

            return defaultLevel;
        }

        private UpdateCriteria GetUpdateCurrencyGreyLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevelCriteria(currencySetting, userContext);
            defaultLevel.LevelId = LimitLevelConstant.GreyLevel;
            defaultLevel.MaxWinLimit = currencySetting.GreyLimit;

            return defaultLevel;
        }

        private UpdateCriteria GetUpdateCurrencyOrangeLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevelCriteria(currencySetting, userContext);
            defaultLevel.LevelId = LimitLevelConstant.OrangeLevel;
            defaultLevel.MaxWinLimit = currencySetting.OrangeLimit;

            return defaultLevel;
        }

        private UpdateCriteria GetUpdateCurrencyYellowLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevelCriteria(currencySetting, userContext);
            defaultLevel.LevelId = LimitLevelConstant.YellowLevel;
            defaultLevel.MaxWinLimit = currencySetting.YellowLimit;

            return defaultLevel;
        }

        private UpdateCriteria GetUpdateCurrencyRedLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            var defaultLevel = GetUpdateCurrencyDefaultLevelCriteria(currencySetting, userContext);
            defaultLevel.LevelId = LimitLevelConstant.RedLevel;
            defaultLevel.MaxWinLimit = currencySetting.RedLimit;

            return defaultLevel;
        }

        private UpdateCriteria GetUpdateCurrencyDefaultLevelCriteria(CurrencySetting currencySetting, UserContext userContext)
        {
            return new UpdateCriteria
            {
                ProductId = currencySetting.ProductId,
                GroupId = currencySetting.GroupId,
                CurrencyId = currencySetting.CurrencyId,
                SiteId = currencySetting.SiteId,
                IsBlockedPlaceBet = currencySetting.IsBlockedPlacebetRedLevel,
                IsBlockedTransfer = currencySetting.IsBlockedTransferRedLevel,
                UserId = userContext.UserId,
                IP = userContext.IP
            };
        }
    }
}
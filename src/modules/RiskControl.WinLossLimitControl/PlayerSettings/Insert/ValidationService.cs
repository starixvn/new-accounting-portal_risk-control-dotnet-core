using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert.Criteria;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    public interface ValidationService
    {
        Task<int> Execute(List<PlayerSetting> playerSettings);
    }

    public class ValidationServiceImp : ValidationService
    {
        private readonly IDynamicRepository repository;

        private readonly IncreamentedSeriesContrainService increamentedSeriesContrainService;

        public ValidationServiceImp(IDynamicRepository repository, IncreamentedSeriesContrainService increamentedSeriesContrainService)
        {
            this.repository = repository;
            this.increamentedSeriesContrainService = increamentedSeriesContrainService;
        }

        public async Task<int> Execute(List<PlayerSetting> playerSettings)
        {
            var isContrainsValid = playerSettings.All(IsValidLevelContrains);
            if (!isContrainsValid)
            {
                return 1;
            }

            var isCurrencySettingAvailable = await IsCurrencySettingAvailable(playerSettings).ConfigureAwait(false);
            return !isCurrencySettingAvailable ? 2 : 0;
        }

        private bool IsValidLevelContrains(PlayerSetting setting)
        {
            return increamentedSeriesContrainService.IsPositiveIncreamented(setting.OrangeLimit, setting.YellowLimit, setting.RedLimit)
                && increamentedSeriesContrainService.IsNegativeIncreamented(setting.BlackLimit, setting.GreyLimit);
        }

        private async Task<bool> IsCurrencySettingAvailable(IEnumerable<PlayerSetting> playerSettings)
        {
            var firstPlayerSetting = playerSettings.First();
            var criteria = new CurrencySettingReadCriteria
            {
                CurrencyId = firstPlayerSetting.CurrencyId,
                GroupId = firstPlayerSetting.GroupId,
                SiteId = firstPlayerSetting.SiteId,
                ProductId = firstPlayerSetting.ProductId
            };

            var settings = await repository.FetchAsync<CurrencySetting>(criteria).ConfigureAwait(false);

            return settings.Any();
        }
    }
}
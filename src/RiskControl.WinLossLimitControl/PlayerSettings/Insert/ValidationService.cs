using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert.Criteria;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert;

public interface ValidationService
{
    Task<int> Execute(List<PlayerSetting> playerSettings);
}

public class ValidationServiceImp(IDynamicRepository repository,
        IncreamentedSeriesContrainService increamentedSeriesContrainService)
    : ValidationService
{
    private const int ValidCode = 0;

    private const int InvalidPlayerSettingErrorCode = 2;

    public const int InvalidCurrencySettingErrorCode = 1;

    public async Task<int> Execute(List<PlayerSetting> playerSettings)
    {
        var isContrainsValid = playerSettings.TrueForAll(IsValidLevelContrains);
        if (!isContrainsValid)
        {
            return InvalidCurrencySettingErrorCode;
        }

        var isCurrencySettingAvailable = await IsCurrencySettingAvailable(playerSettings);
        return isCurrencySettingAvailable ? ValidCode : InvalidPlayerSettingErrorCode;
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

        var settings = await repository.FetchAsync<CurrencySetting>(criteria);

        return settings.Any();
    }
}
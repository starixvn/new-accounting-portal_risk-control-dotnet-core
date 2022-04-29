using System.Collections.Generic;
using System.Linq;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public interface ValidationService
    {
        int Execute(List<CurrencySetting> currencySetting);
    }

    public class ValidationServiceImp : ValidationService
    {
        private readonly IncreamentedSeriesContrainService increamentedSeriesContrainService;

        public ValidationServiceImp(IncreamentedSeriesContrainService increamentedSeriesContrainService)
        {
            this.increamentedSeriesContrainService = increamentedSeriesContrainService;
        }

        public int Execute(List<CurrencySetting> currencySetting)
        {
            var isContrainsValid = currencySetting.All(IsValidLevelContrains);
            return isContrainsValid ? 0 : 1;
        }

        private bool IsValidLevelContrains(CurrencySetting setting)
        {
            return increamentedSeriesContrainService.IsPositiveIncreamented(setting.OrangeLimit, setting.YellowLimit, setting.RedLimit)
                && increamentedSeriesContrainService.IsNegativeIncreamented(setting.BlackLimit, setting.GreyLimit);
        }
    }
}
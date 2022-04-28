using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal
{
    public interface Service
    {
        Task<CurrencyViewStatisticsReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate);
    }

    public class ServiceImp : Service
    {
        private readonly RawService rawService;
        private readonly CalculationService calculationService;

        public ServiceImp(
            RawService rawService,
            CalculationService calculationService)
        {
            this.rawService = rawService;
            this.calculationService = calculationService;
        }

        public async Task<CurrencyViewStatisticsReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
            return calculationService.CalculateGrandTotalForDailyAndCurrencyView(rawData);
        }
    }
}
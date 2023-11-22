using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;

public class ServiceImp<TCriteria>
    (RawService rawService, CalculationService service) : Service<CurrencyViewStatisticsReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    public async Task<CurrencyViewStatisticsReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateGrandTotalForDailyAndCurrencyView(rawData);
    }
}
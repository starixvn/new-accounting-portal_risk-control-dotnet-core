using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main;

public class ServiceImp<TCriteria>
    (RawService rawService, CalculationService service) : Service<DailyViewReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    public async Task<DailyViewReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateDailyViewReport(rawData);
    }
}
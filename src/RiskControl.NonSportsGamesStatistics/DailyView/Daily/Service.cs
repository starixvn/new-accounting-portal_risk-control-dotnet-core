using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily;

public class ServiceImp<TCriteria>
    (RawService rawService, CalculationService service) : Service<DailyReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    public async Task<DailyReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateDailyReport(rawData);
    }
}
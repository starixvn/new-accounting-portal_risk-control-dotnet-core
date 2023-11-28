using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;

public class DeviceServiceImp<TCriteria>
    (RawService rawService, CalculationService service) : Service<DailyViewGroupStatisticWithTotalReportModel,
        TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    public async Task<DailyViewGroupStatisticWithTotalReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateDeviceReport(rawData);
    }
}
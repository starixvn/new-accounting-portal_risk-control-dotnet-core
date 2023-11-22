using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;

public class ServiceImp<TCriteria>
    (RawService rawService, CalculationService service) : Service<UserNameViewGroupStatisticsWithTotalModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    public async Task<UserNameViewGroupStatisticsWithTotalModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<TopTwentyRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateTopTwentyGroupReport(rawData);
    }
}
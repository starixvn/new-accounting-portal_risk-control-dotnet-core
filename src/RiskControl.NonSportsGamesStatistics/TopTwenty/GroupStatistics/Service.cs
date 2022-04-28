using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics
{
    public class ServiceImp : Service<UserNameViewGroupStatisticsWithTotalModel>
    {
        private readonly RawService rawService;
        private readonly CalculationService service;

        public ServiceImp(RawService rawService, CalculationService service)
        {
            this.rawService = rawService;
            this.service = service;
        }

        public async Task<UserNameViewGroupStatisticsWithTotalModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var rawData = await rawService.QueryMultipleData<TopTwentyRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
            return service.CalculateTopTwentyGroupReport(rawData);
        }
    }
}
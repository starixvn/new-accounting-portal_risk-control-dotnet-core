using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main
{
    public class ServiceImp : Service<List<UserNameViewGroupStatisticsWithTotalModel>>
    {
        private readonly RawService rawService;
        private readonly CalculationService service;

        public ServiceImp(RawService rawService, CalculationService service)
        {
            this.rawService = rawService;
            this.service = service;
        }

        public async Task<List<UserNameViewGroupStatisticsWithTotalModel>> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var rawData = await rawService.QueryMultipleData<TopTwentyRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
            return service.CalculateTopTwentyStatisticGroup(rawData);
        }
    }
}
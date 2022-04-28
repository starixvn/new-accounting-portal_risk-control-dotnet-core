using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily
{
    public class ServiceImp : Service<DailyReportModel>
    {
        private readonly RawService rawService;
        private readonly CalculationService service;

        public ServiceImp(RawService rawService, CalculationService service)
        {
            this.rawService = rawService;
            this.service = service;
        }

        public async Task<DailyReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
            return service.CalculateDailyReport(rawData);
        }
    }
}
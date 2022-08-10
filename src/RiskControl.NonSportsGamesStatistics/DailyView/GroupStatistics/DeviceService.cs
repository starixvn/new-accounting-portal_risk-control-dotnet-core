using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics
{
    public class DeviceServiceImp<TCriteria> : Service<DailyViewGroupStatisticWithTotalReportModel, TCriteria>
        where TCriteria: BaseStatisticCriteria
    {
        private readonly RawService rawService;
        private readonly CalculationService service;

        public DeviceServiceImp(RawService rawService, CalculationService service)
        {
            this.rawService = rawService;
            this.service = service;
        }

        public async Task<DailyViewGroupStatisticWithTotalReportModel> Query(TCriteria criteria, DateTime winLossDate)
        {
            var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
            return service.CalculateDeviceReport(rawData);
        }
    }
}
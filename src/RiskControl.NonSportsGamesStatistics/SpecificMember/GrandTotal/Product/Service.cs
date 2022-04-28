using System;
using System.Threading.Tasks;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Product
{
    public class ServiceImp : Service<CurrencyViewStatisticsReportModel>
    {
        private readonly GrandTotalService service;
        private readonly IMapper mapper;

        public ServiceImp(GrandTotalService service, IMapper mapper)
        {
            this.service = service;
            this.mapper = mapper;
        }

        public async Task<CurrencyViewStatisticsReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var historyCriteria = mapper.Map<HistoryCriteria>(criteria);
            var normalCriteria = mapper.Map<NormalCriteria>(criteria);
            normalCriteria.IsNormalMode = true;

            return await service.Query(historyCriteria, normalCriteria);
        }
    }
}

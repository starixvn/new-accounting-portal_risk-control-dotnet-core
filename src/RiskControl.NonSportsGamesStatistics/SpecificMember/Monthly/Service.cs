using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly
{
    public class ServiceImp<TCriteria> : Service<DailyViewReportModel, TCriteria>
        where TCriteria: BaseStatisticCriteria
    {
        private readonly RawService rawService;
        private readonly CalculationService service;
        private readonly IMapper mapper;

        public ServiceImp(RawService rawService, CalculationService service, IMapper mapper)
        {
            this.rawService = rawService;
            this.service = service;
            this.mapper = mapper;
        }

        public async Task<DailyViewReportModel> Query(TCriteria criteria, DateTime winLossDate)
        {
            var historyCriteria = mapper.Map<HistoryCriteria>(criteria);
            var normalCriteria = mapper.Map<NormalCriteria>(criteria);
            normalCriteria.IsNormalMode = true;

            var rawData = await rawService.QueryDataFromBettransAndWarehouse<BaseRawStatistic>(historyCriteria, normalCriteria);

            rawData.RawStatistics = CalculateRawStatistics(rawData.RawStatistics);
            rawData.Total = CalculateTotal(rawData.Total);

            return service.CalculateDailyViewReport(rawData);
        }

        private IEnumerable<BaseRawStatistic> CalculateRawStatistics(IEnumerable<BaseRawStatistic> rawData)
        {
            var monthlyRawData = rawData
                .Where(item => item.NoOfPlayers != 0)
                .Select(x =>
                {
                    x.ReportBy = $"{Convert.ToDateTime(x.ReportBy):MM/yyyy}";
                    return x;
                });

            var groups = monthlyRawData.GroupBy(x => new { x.ReportById, x.ReportBy, x.CurrencyId });

            var result = from @group in groups
                         let items = monthlyRawData.Where(x => x.ReportById == @group.Key.ReportById && x.ReportBy == @group.Key.ReportBy && x.CurrencyId == @group.Key.CurrencyId)
                         select CalculateSumStatistics(items);

            return result;
        }

        private BaseRawStatistic CalculateSumStatistics(IEnumerable<BaseRawStatistic> rawStatistics)
        {
            return service.CalculateSum(rawStatistics);
        }

        private List<BaseRawStatistic> CalculateTotal(IEnumerable<BaseRawStatistic> rawStatistics)
        {
            return new List<BaseRawStatistic>
            {
                service.CalculateSum(rawStatistics)
            };
        }
    }
}


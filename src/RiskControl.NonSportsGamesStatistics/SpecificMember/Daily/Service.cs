using System;
using System.Threading.Tasks;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Daily;

public class ServiceImp<TCriteria> : Service<DailyViewReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    private readonly DailyService dailyService;
    private readonly IMapper mapper;

    public ServiceImp(DailyService dailyService, IMapper mapper)
    {
        this.dailyService = dailyService;
        this.mapper = mapper;
    }

    public async Task<DailyViewReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var historyCriteria = mapper.Map<HistoryCriteria>(criteria);
        var normalCriteria = mapper.Map<NormalCriteria>(criteria);
        normalCriteria.IsNormalMode = true;

        return await dailyService.Query(historyCriteria, normalCriteria);
    }
}
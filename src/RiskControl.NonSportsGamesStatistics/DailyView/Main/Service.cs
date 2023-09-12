using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main;

public class ServiceImp<TCriteria> : Service<DailyViewReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    private readonly RawService rawService;
    private readonly CalculationService service;

    public ServiceImp(RawService rawService, CalculationService service)
    {
        this.rawService = rawService;
        this.service = service;
    }

    public async Task<DailyViewReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateDailyViewReport(rawData);
    }
}
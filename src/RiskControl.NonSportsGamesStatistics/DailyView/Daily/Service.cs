using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Daily;

public class ServiceImp<TCriteria> : Service<DailyReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    private readonly RawService rawService;
    private readonly CalculationService service;

    public ServiceImp(RawService rawService, CalculationService service)
    {
        this.rawService = rawService;
        this.service = service;
    }

    public async Task<DailyReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<BaseRawStatistic>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateDailyReport(rawData);
    }
}
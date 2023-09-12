using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;

public class CompanyServiceImp<TCriteria> : Service<DailyViewGroupStatisticWithTotalReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    private readonly RawService rawService;
    private readonly CalculationService service;

    public CompanyServiceImp(RawService rawService, CalculationService service)
    {
        this.rawService = rawService;
        this.service = service;
    }

    public async Task<DailyViewGroupStatisticWithTotalReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<CompanyRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateCompanyReport(rawData);
    }
}
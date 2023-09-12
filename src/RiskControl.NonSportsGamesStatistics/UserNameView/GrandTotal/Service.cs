using System;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal;

public class ServiceImp<TCriteria> : Service<UserNameViewReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    private readonly RawService rawService;
    private readonly CalculationService service;

    public ServiceImp(RawService rawService, CalculationService service)
    {
        this.rawService = rawService;
        this.service = service;
    }

    public async Task<UserNameViewReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var rawData = await rawService.QueryMultipleData<UserNameViewRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateUserNameViewGrandTotal(rawData);
    }
}
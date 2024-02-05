using RiskControl.AssociatedAcccount;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using System;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount;

public class ServiceImp<TCriteria>(RawService rawService,
        CalculationService service,
        AssociatedAccountService associatedAccountService)
    : Service<UserNameViewReportModel, TCriteria>
    where TCriteria: BaseStatisticCriteria
{
    public async Task<UserNameViewReportModel> Query(TCriteria criteria, DateTime winLossDate)
    {
        var userNames = await associatedAccountService.GetAssociatedCustomerUsername(criteria.CustId);

        criteria.UserName = string.Join(",", userNames);
        criteria.Site = "All";
        var rawData = await rawService.QueryMultipleData<UserNameViewRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateUserNameViewReport(rawData);
    }
}
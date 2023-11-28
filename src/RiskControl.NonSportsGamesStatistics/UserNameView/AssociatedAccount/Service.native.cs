using RiskControl.AssociatedAcccount;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using System;
using System.Linq;
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
        var associatedByDevice = await associatedAccountService.GetAssociatedByDevice(criteria.CustId);
        var associatedByManual = await associatedAccountService.GetAssociatedByManual(criteria.CustId);
        var associatedByIp = await associatedAccountService.GetAssociateddByIp(criteria.CustId);

        var associatedAccounts = associatedByDevice.Concat(associatedByManual).Concat(associatedByIp);
        var usenames = associatedAccounts.Select(x => x.Username);

        criteria.UserName = string.Join(",", usenames);
        criteria.Site = "All";
        var rawData = await rawService.QueryMultipleData<UserNameViewRawStatistics>(criteria, winLossDate).ConfigureAwait(false);
        return service.CalculateUserNameViewReport(rawData);
    }
}
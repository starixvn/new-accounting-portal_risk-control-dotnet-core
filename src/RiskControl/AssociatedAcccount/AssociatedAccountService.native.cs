using Fanex.Data.Repository;
using System.Linq;
using Fanex.Logging;

namespace RiskControl.AssociatedAcccount;

using Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface AssociatedAccountService
{
    Task<IEnumerable<string>> GetAssociatedCustomerUsername(int custId);

    Task<List<AssociationAccountModel>> GetAssociatedAccount(int custId);
}

public class AssociatedAccountServiceImp(
        ConfigurationService configurationService,
        CustomerTrackingSystemApiService customerTrackingSystemApiService,
        IDynamicRepository repository) : AssociatedAccountService
{
    public async Task<IEnumerable<string>> GetAssociatedCustomerUsername(int custId)
    {
        var associationModel = await GetAssociatedCustomer(custId);
        var customerSites = await repository.FetchAsync<CustomerSiteModel>(new CustomerSiteCriteria { CustIdList = string.Join(",", associationModel.Select(x => x.CustId)) });
        
        return customerSites.Select(x => x.Username).Distinct();
    }

    public async Task<List<AssociationAccountModel>> GetAssociatedAccount(int custId)
    {
        var associatedCustomers = await GetAssociatedCustomer(custId);
        var custIds = associatedCustomers.Select(x => x.CustId).Distinct();
        await LogService.InfoAsync($"GetAssociatedAccount - Custid: {string.Join(",", custIds)}");
        var customerSites =  await repository.FetchAsync<CustomerSiteModel>(new CustomerSiteCriteria { CustIdList = string.Join(",", custIds) });

        var data = (from a in associatedCustomers
            join ct in customerSites on a.CustId equals ct.CustId
            select new AssociationAccountModel
            {
                Account = ct.Username, Site = ct.SiteName, AssociationTypeName = a.AssociationTypeName, LastTicketDate = a.LastTicketDate

            }).Distinct();
        var result = data.GroupBy(g => new { g.Site, g.Account, g.LastTicketDate }).Select(r => new AssociationAccountModel
        {
            Account = r.Key.Account,
            Site = r.Key.Site,
            LastTicketDate = r.Key.LastTicketDate,
            AssociationTypeName = string.Join(", ", r.ToList().Select(x => x.AssociationTypeName))
        }).OrderBy(o => o.Account);
        return result.ToList();
    }

    private async Task<List<AssociationModel>> GetAssociatedCustomer(int custId)
    {
        var associationModel = await customerTrackingSystemApiService.GetAssociatedCustomer(
            configurationService.FraudSystemCTSAPI,
            custId).ConfigureAwait(false);

        return associationModel ?? [];
    }
}
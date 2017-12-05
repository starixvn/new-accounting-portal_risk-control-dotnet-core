using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Olympus.DotNetCore.FPSApiClient;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    public interface AssociatedCustomerByDeviceService
    {
        Task<List<AssociatedUser>> Execute(IEnumerable<CustomerDevice> customers);
    }

    public class AssociatedCustomerByDeviceServiceImp : AssociatedCustomerByDeviceService
    {
        private readonly IDynamicRepository repository;

        public AssociatedCustomerByDeviceServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<List<AssociatedUser>> Execute(IEnumerable<CustomerDevice> customers)
        {
            var usernames = customers.Select(a => a.Account).Distinct();
            var customerSites = await GetCustomerSites(usernames).ConfigureAwait(false);

            return customers.Join(
                customerSites,
                a => a.Account.ToUpperInvariant(),
                c => c.Username.ToUpperInvariant(),
                (a, c) => new AssociatedUser
                {
                    Username = c.Username,
                    SiteName = c.SiteName,
                    Evidence = a.Device,
                    LastAccessedDate = a.LastAccessedDate
                })
                .OrderByDescending(c => c.LastAccessedDate)
                .ThenBy(c => c.SiteName)
                .ThenBy(c => c.Username)
                .ToList();
        }

        private async Task<IEnumerable<CustomerSite>> GetCustomerSites(IEnumerable<string> usernames)
        {
            var usernameList = string.Join(",", usernames);

            var criteria = new CustomerSiteQueryCriteria { UsernameList = usernameList };
            return await repository.FetchAsync<CustomerSite>(criteria).ConfigureAwait(false);
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    public interface AssociatedCustomerByIPService
    {
        Task<List<AssociatedUser>> Execute(string ip, int ignoredCustId);
    }

    public class AssociatedCustomerByIPServiceImp : AssociatedCustomerByIPService
    {
        private readonly IDynamicRepository repository;

        public AssociatedCustomerByIPServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
            TopCustomer = 1000;
        }

        public int TopCustomer { get; set; }

        public async Task<List<AssociatedUser>> Execute(string ip, int ignoredCustId)
        {
            var customerIPs = await GetCustomers(ip, ignoredCustId).ConfigureAwait(false);
            customerIPs = GetCustomersByTop(customerIPs);

            var customerIdList = customerIPs.Select(c => c.CustId);
            var customerSites = await GetCustomerSites(customerIdList).ConfigureAwait(false);

            return customerSites.Join(
                customerIPs,
                c => c.CustId,
                i => i.CustId,
                (c, i) => new AssociatedUser
                {
                    Username = c.Username,
                    SiteName = c.SiteName,
                    Evidence = i.IP,
                    LastAccessedDate = i.LastAccessedDate
                })
                 .OrderByDescending(c => c.LastAccessedDate)
                .ThenBy(c => c.SiteName)
                .ThenBy(c => c.Username)
                .ToList();
        }

        private async Task<IEnumerable<CustomerIP>> GetCustomers(string ip, int ignoredCustId)
        {
            var criteria = new CustomerByIPQueryCriteria { IP = ip };
            var customers = await repository.FetchAsync<CustomerIP>(criteria).ConfigureAwait(false);

            var criteriaOld = new CustomerByIPOldQueryCriteria { IP = ip };
            var oldCustomers = await repository.FetchAsync<CustomerIP>(criteriaOld).ConfigureAwait(false);

            return customers
                .Union(oldCustomers)
                .Where(c => c.CustId != ignoredCustId);
        }

        private List<CustomerIP> GetCustomersByTop(IEnumerable<CustomerIP> customers)
        {
            var customersResult = customers.OrderByDescending(c => c.LastAccessedDate);

            var result = new List<CustomerIP>();
            foreach (var customer in customersResult)
            {
                if (result.Count < TopCustomer && result.All(c => c.CustId != customer.CustId))
                {
                    result.Add(customer);
                }
            }

            return result;
        }

        private async Task<IEnumerable<CustomerSite>> GetCustomerSites(IEnumerable<int> customerIds)
        {
            var customerIdList = string.Join(",", customerIds);

            var criteria = new CustomerSiteByCustomerIdQueryCriteria { CustomerIdList = customerIdList };
            return await repository.FetchAsync<CustomerSite>(criteria).ConfigureAwait(false);
        }
    }
}
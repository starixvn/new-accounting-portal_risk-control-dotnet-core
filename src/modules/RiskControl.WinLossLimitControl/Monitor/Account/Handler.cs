using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using Olympus.DotNetCore.FPSApiClient;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    public class Handler : IAsyncRequestHandler<Request, AccountModel>
    {
        private readonly IDynamicRepository repository;

        private readonly FraudService fraudService;

        private readonly AssociatedCustomerByIPService associatedCustomerByIPService;

        private readonly AssociatedCustomerByDeviceService associatedCustomerByDeviceService;

        public Handler(
            IDynamicRepository repository,
            FraudService fraudService,
            AssociatedCustomerByIPService associatedCustomerByIPService,
            AssociatedCustomerByDeviceService associatedCustomerByDeviceService)
        {
            this.repository = repository;
            this.fraudService = fraudService;
            this.associatedCustomerByIPService = associatedCustomerByIPService;
            this.associatedCustomerByDeviceService = associatedCustomerByDeviceService;
        }

        public async Task<AccountModel> Handle(Request message)
        {
            var customer = await GetCustomer(message.CustId).ConfigureAwait(false);
            var accountsByDevice = await GetAssociatedAccountsByDevice(customer.Username, customer.SiteName, customer.IsCreditUser).ConfigureAwait(false);
            var accountsByIP = await GetAssociatedAccountsByIP(message.CustId, customer.Username, customer.SiteName, customer.IsCreditUser).ConfigureAwait(false);
            return new AccountModel
            {
                Customer = customer,
                UsersByDevice = accountsByDevice,
                UsersByIP = accountsByIP
            };
        }

        private async Task<Customer> GetCustomer(int customerId)
        {
            var criteria = new CustomerQueryCriteria { CustomerId = customerId };
            return await repository.GetAsync<Customer>(criteria).ConfigureAwait(false);
        }

        private async Task<List<AssociatedUser>> GetAssociatedAccountsByDevice(string username, string siteName, bool isCreditSite)
        {
            const string url ="Franklin";
            var customerDevices = await fraudService.GetAssociatedCustomers(url, username, siteName, isCreditSite).ConfigureAwait(false);

            return await associatedCustomerByDeviceService.Execute(customerDevices).ConfigureAwait(false);
        }

        private async Task<List<AssociatedUser>> GetAssociatedAccountsByIP(int customerId, string username, string siteName, bool isCreditSite)
        {
            const string url ="Franklin";
            var ip = await fraudService.GetLatestIP(url, username, siteName, isCreditSite).ConfigureAwait(false);
            return await associatedCustomerByIPService.Execute(ip, customerId).ConfigureAwait(false);
        }
    }
}
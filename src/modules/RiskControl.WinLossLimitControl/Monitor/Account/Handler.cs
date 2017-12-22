using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.FPSApiClient;
using RiskControl.WinLossLimitControl.Configurations;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account {
    public class Handler : IRequestHandler<Request, AccountModel> {
        private readonly IDynamicRepository repository;

        private readonly FraudService fraudService;

        private readonly AssociatedCustomerByIPService associatedCustomerByIPService;

        private readonly AssociatedCustomerByDeviceService associatedCustomerByDeviceService;

        private readonly IOptions<WinLossLimitControlOptions> winLossLimitControlOptions;

        public Handler (
            IDynamicRepository repository,
            FraudService fraudService,
            AssociatedCustomerByIPService associatedCustomerByIPService,
            AssociatedCustomerByDeviceService associatedCustomerByDeviceService,
            IOptions<WinLossLimitControlOptions> winLossLimitControlOptions) {
            this.repository = repository;
            this.fraudService = fraudService;
            this.associatedCustomerByIPService = associatedCustomerByIPService;
            this.associatedCustomerByDeviceService = associatedCustomerByDeviceService;
            this.winLossLimitControlOptions = winLossLimitControlOptions;
        }

        public async Task<AccountModel> Handle (Request request, CancellationToken cancellationToken) {
            var customer = await GetCustomer (request.CustId).ConfigureAwait (false);
            var accountsByDevice = await GetAssociatedAccountsByDevice (customer.Username, customer.SiteName, customer.IsCreditUser).ConfigureAwait (false);
            var accountsByIP = await GetAssociatedAccountsByIP (request.CustId, customer.Username, customer.SiteName, customer.IsCreditUser).ConfigureAwait (false);
            return new AccountModel {
                Customer = customer,
                UsersByDevice = accountsByDevice,
                UsersByIP = accountsByIP
            };
        }

        private async Task<Customer> GetCustomer (int customerId) {
            var criteria = new CustomerQueryCriteria { CustomerId = customerId };
            return await repository.GetAsync<Customer> (criteria).ConfigureAwait (false);
        }

        private async Task<List<AssociatedUser>> GetAssociatedAccountsByDevice (string username, string siteName, bool isCreditSite) {
            var url = winLossLimitControlOptions.Value.FraudSystemApi;
            var customerDevices = await fraudService.GetAssociatedCustomers (url, username, siteName, isCreditSite).ConfigureAwait (false);

            return await associatedCustomerByDeviceService.Execute (customerDevices).ConfigureAwait (false);
        }

        private async Task<List<AssociatedUser>> GetAssociatedAccountsByIP (int customerId, string username, string siteName, bool isCreditSite) {
            var url = winLossLimitControlOptions.Value.FraudSystemApi;
            var ip = await fraudService.GetLatestIP (url, username, siteName, isCreditSite).ConfigureAwait (false);
            return await associatedCustomerByIPService.Execute (ip, customerId).ConfigureAwait (false);
        }
    }
}
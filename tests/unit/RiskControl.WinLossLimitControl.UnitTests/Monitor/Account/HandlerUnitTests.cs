using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.Account;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using RiskControl.WinLossLimitControl.UnitTests.Utilities;
using Olympus.DotNetCore.FPSApiClient;
using System.Threading;
using RiskControl.WinLossLimitControl.Configurations;
using Microsoft.Extensions.Options;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_ReturnsDataFromServices()
        {
            // Arrange
            var fakeCustomer = TestDataLoader.Load<Customer>("Customer");
            var fakeFraudCustomerDevices = TestDataLoader.Load<List<CustomerDevice>>("CustomerDevices");
            var fakeCustomerDevices = TestDataLoader.Load<List<CustomerDevice>>("CustomerDevices");
            var fakeAssociatedCustomerByDevices = TestDataLoader.Load<List<AssociatedUser>>("AssociatedCustomerByDevices");
            var fakeAssociatedCustomerByIPs = TestDataLoader.Load<List<AssociatedUser>>("AssociatedCustomerByIPs");

            var repository = Substitute.For<IDynamicRepository>();
            repository.GetAsync<Customer>(Arg.Any<ICriteria>()).Returns(fakeCustomer);

            var fraudService = Substitute.For<FraudService>();
            fraudService.GetAssociatedCustomers(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<bool>()).Returns(fakeFraudCustomerDevices);
            fraudService.GetLatestIP(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<bool>()).Returns("ANY IP");

            var associatedCustomerByDeviceService = Substitute.For<AssociatedCustomerByDeviceService>();
            associatedCustomerByDeviceService.Execute(Arg.Any<IEnumerable<CustomerDevice>>()).Returns(fakeAssociatedCustomerByDevices);

            var associatedCustomerByIPService = Substitute.For<AssociatedCustomerByIPService>();
            associatedCustomerByIPService.Execute(Arg.Any<string>(), Arg.Any<int>()).Returns(fakeAssociatedCustomerByIPs);

            var winLossLimitControlOptions = 
                Options.Create<WinLossLimitControlOptions>(new WinLossLimitControlOptions{FraudSystemApi = string.Empty});

            // Act
            var handler = new Handler(repository, fraudService, associatedCustomerByIPService, associatedCustomerByDeviceService, winLossLimitControlOptions);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            var expected = TestDataLoader.Load<AccountModel>("expected");
            DeepAssert.Equal(result, expected);
        }
    }
}
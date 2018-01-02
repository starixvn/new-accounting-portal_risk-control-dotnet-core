using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.Account;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using RiskControl.WinLossLimitControl.UnitTests.Utilities;
using Olympus.DotNetCore.FPSApiClient;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account
{
    public class AssociatedCustomerByDeviceServiceUnitTests
    {
        [Fact]
        public async Task Execute_Always_ReturnsListOfAssociatedCustomer()
        {
            // Arrange
            var expected = TestDataLoader.Load<List<AssociatedUser>>("expected");
            var customerDevices = TestDataLoader.Load<List<CustomerDevice>>("CustomerDevices");

            var service = CreateAssociatedCustomerByDeviceServiceImp();

            // Act
            var result = await service.Execute(customerDevices);

            // Assert
            DeepAssert.Equal(result, expected);
        }

        private AssociatedCustomerByDeviceService CreateAssociatedCustomerByDeviceServiceImp()
        {
            var fakeCustomerSites = TestDataLoader.Load<List<CustomerSite>>("CustomerSites");

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CustomerSite>(Arg.Any<CustomerSiteQueryCriteria>()).Returns(fakeCustomerSites);

            return new AssociatedCustomerByDeviceServiceImp(repository);
        }
    }
}
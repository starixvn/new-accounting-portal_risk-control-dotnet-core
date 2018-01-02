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

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account
{
    public class AssociatedCustomerByIPServiceUnitTests
    {
        [Fact]
        public async Task Execute_Always_ReturnsListOfAssociatedCustomer()
        {
            // Arrange
            const int IgnoredCustId = 2000000;
            var expected = TestDataLoader.Load<List<AssociatedUser>>("expected");

            // Act
            var service = CreateAssociatedCustomerByIPService();
            var result = await service.Execute(string.Empty, IgnoredCustId);

            // Assert
            DeepAssert.Equal(result, expected);
        }

        private AssociatedCustomerByIPService CreateAssociatedCustomerByIPService()
        {
            var fakeCustomerIps = TestDataLoader.Load<List<CustomerIP>>("CustomerIPs");

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CustomerIP>(Arg.Any<CustomerByIPQueryCriteria>()).Returns(fakeCustomerIps);
            repository.FetchAsync<CustomerIP>(Arg.Any<CustomerByIPOldQueryCriteria>()).Returns(fakeCustomerIps);

            var fakeCustomerSites = TestDataLoader.Load<List<CustomerSite>>("CustomerSites");
            repository.FetchAsync<CustomerSite>(Arg.Any<CustomerSiteByCustomerIdQueryCriteria>()).Returns(fakeCustomerSites);

            return new AssociatedCustomerByIPServiceImp(repository) { TopCustomer = 2 };
        }
    }
}
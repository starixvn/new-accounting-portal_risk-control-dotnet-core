using System.Collections.Generic;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.AssociatedAcccount;
using RiskControl.WinLossLimitControl.Monitor.Account;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnRightData()
    {
        // Arrange
        var expectedAccountModel = TestDataProvider.Load<AccountModel>("account-model");
        var expectedCustomer = new List<Customer>
        {
            new() { CustId = 1290, IsCreditUser = true, SiteName = "BEST-ODDS", RoleId = 1, Username = "302RM" },
            new() { CustId = 1262, IsCreditUser = true, SiteName = "BEST-ODDS", RoleId = 2, Username = "wsrm" },
            new() { CustId = 4174, IsCreditUser = true, SiteName = "BEST-ODDS", RoleId = 3, Username = "mrm" },
            new() { CustId = 2, IsCreditUser = true, SiteName = "BEST-ODDS", RoleId = 4, Username = "SA-RM" }
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<Customer>(Arg.Compat.Any<CustomerQueryCriteria>()).Returns(expectedCustomer);

        var associatedAccountService = Substitute.For<AssociatedAccountService>();
        associatedAccountService.GetAssociatedAccount(Arg.Compat.Any<int>()).Returns([]);
        
        var handle = new Handler(repository, associatedAccountService);

        // Act
        var actualResult = await handle.Handle(new Request(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedAccountModel, actualResult);
    }
}
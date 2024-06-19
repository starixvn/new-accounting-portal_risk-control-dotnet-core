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
        var repository = Substitute.For<IDynamicRepository>();
        repository.GetAsync<Customer>(Arg.Compat.Any<CustomerQueryCriteria>()).Returns(expectedAccountModel.Customer);

        var associatedAccountService = Substitute.For<AssociatedAccountService>();
        associatedAccountService.GetAssociatedAccount(Arg.Compat.Any<int>()).Returns([]);
        
        var handle = new Handler(repository, associatedAccountService);

        // Act
        var actualResult = await handle.Handle(new Request(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedAccountModel, actualResult);
    }
}
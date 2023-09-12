using Fanex.Caching;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.Core.BalanceUp;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using Xunit;

namespace RiskControl.Core.UnitTests.BalanceUp;

public class BalanceUpServiceUnitTests
{
    private static BalanceUpRange BalanceUpRangeData =>
        new()
        {
            BalanceUpDay = new DateTime(2022, 10, 10),
            MoveBetsDay = new DateTime(2022, 10, 10)
        };

    [Fact]
    public void Query_Always_ReturnExpectedData()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();

        var cacheService = Substitute.For<ICacheService>();
        cacheService.GetOrSet(Arg.Compat.Any<string>(), Arg.Compat.Any<Func<BalanceUpRange>>()).Returns(BalanceUpRangeData);

        // Act
        var balanceUpService = new BalanceUpServiceImp(repository, cacheService);
        var expectedData = balanceUpService.Query();

        // Assert
        DeepAssert.Equal(expectedData, BalanceUpRangeData);
    }
}
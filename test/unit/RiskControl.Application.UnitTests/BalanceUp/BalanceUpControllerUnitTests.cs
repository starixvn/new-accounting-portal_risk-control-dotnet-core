using NSubstitute;
using RiskControl.Application.BalanceUp;
using RiskControl.Core.BalanceUp;
using System;
using Xunit;

namespace RiskControl.Application.UnitTests.BalanceUp;

public class BalanceUpControllerUnitTests
{
    [Fact]
    public void Index_Always_ReturnExpectedViewModel()
    {
        // Arrange
        var balanceUpRange = new BalanceUpRange
        {
            BalanceUpDay = new DateTime(2000, 1, 1),
            MoveBetsDay = new DateTime(2001, 1, 1)
        };
        var balanceUpService = Substitute.For<BalanceUpService>();
        balanceUpService.Query().Returns(balanceUpRange);

        // Act
        var controller = new BalanceUpController(balanceUpService);
        var actualResults = controller.Index();

        // Assert
        var expectedList = new ViewModel
        {
            BalanceUpRange = balanceUpRange,
            Today = DateTime.Today
        };
        Assert.Equal(actualResults.BalanceUpRange, expectedList.BalanceUpRange);
        Assert.Equal(actualResults.Today.GetDateTimeFormats('d'), expectedList.Today.GetDateTimeFormats('d'));
    }
}
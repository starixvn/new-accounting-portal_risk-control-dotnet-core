using NSubstitute;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_InvalidParameter_ReturnsResultFromValidationService()
    {
        // Arrange
        var userHttpContext = Substitute.For<UserHttpContext>();

        const int InvalidErrorCode = 1;
        var validationService = Substitute.For<ValidationService>();
        validationService.Execute(Arg.Compat.Any<Request>()).Returns(InvalidErrorCode);

        var updateService = Substitute.For<UpdateService>();

        // Act
        var handler = new Handler(userHttpContext, validationService, updateService);
        var actualResult = await handler.Handle([], new CancellationToken());

        // Assert
        Assert.Equal(InvalidErrorCode, actualResult.ErrorCode);
    }

    [Fact]
    public async Task Handle_ValidParameter_ExecuteSuccessfully()
    {
        // Arrange
        var userHttpContext = Substitute.For<UserHttpContext>();

        const int ValidErrorCode = 0;
        var validationService = Substitute.For<ValidationService>();
        validationService.Execute(Arg.Compat.Any<Request>()).Returns(ValidErrorCode);

        var updateService = Substitute.For<UpdateService>();

        // Act
        var handler = new Handler(userHttpContext, validationService, updateService);
        var actualResult = await handler.Handle([], new CancellationToken());

        // Assert
        Assert.Equal(0, actualResult.ErrorCode);
    }
}
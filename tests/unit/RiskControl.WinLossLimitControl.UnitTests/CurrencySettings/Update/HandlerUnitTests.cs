using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.Services;
using Olympus.DotNetCore.Authentication;
using System.Threading;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_InvalidParameter_ReturnsResultFromValidationService()
        {
            // Arrange
            var stateService = Substitute.For<StateService>();

            const int InvalidErrorCode = 1;
            var validationService = Substitute.For<ValidationService>();
            validationService.Execute(Arg.Any<Request>()).Returns(InvalidErrorCode);

            var updateService = Substitute.For<UpdateService>();

            // Act
            var handler = new Handler(stateService, validationService, updateService);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            Assert.Equal(result.ErrorCode, InvalidErrorCode);
        }

        [Fact]
        public async Task Handle_ValidParameter_ExecuteSuccessfully()
        {
            // Arrange
            var stateService = Substitute.For<StateService>();

            const int ValidErrorCode = 0;
            var validationService = Substitute.For<ValidationService>();
            validationService.Execute(Arg.Any<Request>()).Returns(ValidErrorCode);

            var updateService = Substitute.For<UpdateService>();

            // Act
            var handler = new Handler(stateService, validationService, updateService);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            Assert.Equal(result.ErrorCode, 0);
        }
    }
}
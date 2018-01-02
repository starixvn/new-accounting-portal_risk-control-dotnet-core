using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.PlayerSettings.Update;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using Olympus.DotNetCore.Authentication;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Update
{
    public class HandlerUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_InvalidParameter_ReturnsResultFromValidationService()
        {
            // Arrange
            var stateService = Substitute.For<StateService>();

            var validationService = Substitute.For<ValidationService>();
            validationService.Execute(Arg.Any<Request>()).Returns(false);

            var repository = Substitute.For<IDynamicRepository>();

            // Act
            var handler = new Handler(stateService, validationService, repository);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            Assert.Equal(result.ErrorCode, 1);
        }

        [Fact]
        public async Task Handle_ValidParameter_ExecuteSuccessfully()
        {
            // Arrange
            var stateService = Substitute.For<StateService>();

            var validationService = Substitute.For<ValidationService>();
            validationService.Execute(Arg.Any<Request>()).Returns(true);

            var repository = Substitute.For<IDynamicRepository>();

            // Act
            var handler = new Handler(stateService, validationService, repository);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            Assert.Equal(result.ErrorCode, 0);
        }
    }
}
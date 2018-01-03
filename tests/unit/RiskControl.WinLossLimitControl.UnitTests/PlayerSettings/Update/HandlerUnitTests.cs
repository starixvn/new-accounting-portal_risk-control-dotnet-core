using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.PlayerSettings.Update;
using RiskControl.WinLossLimitControl.Services;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Update {
    public class HandlerUnitTests : IClassFixture<AutoMapperFixture> {
        [Fact]
        public async Task Handle_InvalidParameter_ReturnsResultFromValidationService () {
            // Arrange
            var stateService = Substitute.For<StateService> ();

            var validationService = Substitute.For<ValidationService> ();
            validationService.Execute (Arg.Any<Request> ()).Returns (false);

            var repository = Substitute.For<IDynamicRepository> ();

            // Act
            var handler = new Handler (stateService, validationService, repository);
            var result = await handler.Handle (new Request (), CancellationToken.None);

            // Assert
            Assert.Equal (1, result.ErrorCode);
        }

        [Fact]
        public async Task Handle_ValidParameter_ExecuteSuccessfully () {
            // Arrange
            var stateService = Substitute.For<StateService> ();

            var validationService = Substitute.For<ValidationService> ();
            validationService.Execute (Arg.Any<Request> ()).Returns (true);

            var repository = Substitute.For<IDynamicRepository> ();

            // Act
            var handler = new Handler (stateService, validationService, repository);
            var result = await handler.Handle (new Request (), CancellationToken.None);

            // Assert
            Assert.Equal (0, result.ErrorCode);
        }
    }
}
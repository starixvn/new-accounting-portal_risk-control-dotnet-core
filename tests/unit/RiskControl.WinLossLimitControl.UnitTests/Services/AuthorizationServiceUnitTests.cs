using System.Linq;
using NSubstitute;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Services;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Services {
    public class AuthorizationServiceUnitTests {
        [Fact]
        public void HasPermission_UserHasHostPermission_UserShouldHaveReadPermission () {
            // Arrange
            var function = new Function ("AnyKey", Policy.Read);
            var functions = new [] { function };
            var stateService = Substitute.For<StateService> ();
            stateService.Functions.Returns(functions);

            // Act
            var service = new AuthorizationServiceImp (stateService);
            var result = service.HasPermission ("AnyKey", Policy.Read);

            // Assert
            Assert.True (result);
        }
    }
}
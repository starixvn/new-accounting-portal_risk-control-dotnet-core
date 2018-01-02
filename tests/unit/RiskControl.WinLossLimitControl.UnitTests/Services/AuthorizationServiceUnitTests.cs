using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.Services;
using Olympus.DotNetCore.Authentication;
using System.Linq;

namespace RiskControl.WinLossLimitControl.UnitTests.Services
{
    public class AuthorizationServiceUnitTests
    {
        [Fact]
        public void HasPermission_UserHasHostPermission_UserShouldHaveReadPermission()
        {
            // Arrange
            var function = new Function("AnyKey", Policy.Read);
            var stateService = Substitute.For<StateService>();
            stateService.Functions.FirstOrDefault(f => f.Key == "AnyKey").Returns(function);

            // Act
            var service = new AuthorizationServiceImp(stateService);
            var result = service.HasPermission("AnyKey", Policy.Read);

            // Assert
            Assert.True(result);
        }
    }
}
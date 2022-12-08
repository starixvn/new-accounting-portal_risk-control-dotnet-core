using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Services;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Filter
{
    public class AuthorizationControllerUnitTests
    {
        [Fact]
        public void HaveHostPermission_Always_ReturnsDataFromAuthorizationService()
        {
            // Arrange
            var authorizationService = Substitute.For<AuthorizationService>();
            authorizationService.HasPermission(Arg.Compat.Any<string>(), Arg.Compat.Any<Constant.Policy>()).Returns(true);

            // Act
            var controller = new AuthorizationController(authorizationService);
            var hostPermission = controller.HasHostPermission() as OkObjectResult;
            var actualResult = (HostPermission)hostPermission.Value;

            // Assert
            Assert.True(actualResult.WinLimitMonitor);
            Assert.True(actualResult.PlayerWinLimitManagement);
            Assert.True(actualResult.CurrencyWinLimitSetting);
        }
    }
}

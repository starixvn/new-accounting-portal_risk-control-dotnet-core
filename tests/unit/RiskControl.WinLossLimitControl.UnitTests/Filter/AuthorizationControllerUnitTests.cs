using System.Web.Http.Results;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Services;
using RiskControl.WinLossLimitControl.Configurations;
using Olympus.DotNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.Filter
{
    public class AuthorizationControllerUnitTests
    {
        [Fact]
        public void HaveHostPermission_Always_ReturnsDataFromAuthorizationService()
        {
            // Arrange
            var authorizationService = Substitute.For<AuthorizationService>();
            authorizationService.HasPermission(FunctionKeys.PlayerWinLimitManagement, Policy.Write).Returns(true);

            // Act
            var controller = new AuthorizationController(authorizationService);
            var actionResult = controller.HasHostPermission();
            var jsonResult = actionResult as JsonResult;

            // Assert
            Assert.True((bool)jsonResult.Value);
        }
    }
}
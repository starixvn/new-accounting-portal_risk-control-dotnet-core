using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models;
using NSubstitute;
using RiskControl.Application.Header;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.Application.UnitTests.Header
{
    public class HeaderControllerUnitTests
    {
        private static List<MenuItem> MenuItemList =>
            new List<MenuItem>
                {
                    new MenuItem
                    {
                        DisplayOrder = 3,
                        Environment = "LIVE",
                        FunctionName = "Betting Monitoring",
                        Id = 562,
                        IsActive = true,
                        Name = "Betting Monitoring",
                        ParentId = 0,
                        ParentName = "",
                        Policy = 1,
                        Url = ""
                    },
                    new MenuItem
                    {
                        DisplayOrder = 1,
                        Environment = "LIVE",
                        FunctionName = "Bet Setting Monitoring",
                        Id = 563,
                        IsActive = true,
                        Name = "Bet Setting Monitoring",
                        ParentId = 562,
                        ParentName = "Betting Monitoring",
                        Policy = 2,
                        Url = "/BettingMonitoring/BettingMonitoringLoad/Index"
                    }
                };

        [Fact]
        public void Index_Always_ReturnExpectedHeader()
        {
            // Arrange
            var napSession = Substitute.For<INapSession>();
            napSession.MenuItemList = MenuItemList;
            napSession.UserName = "sa";

            // Act
            var controller = new HeaderController(napSession);
            var actualResults = controller.Index();

            // Assert
            Assert.Single(actualResults.Menus);
            Assert.Equal("sa", actualResults.Username);
        }
    }
}

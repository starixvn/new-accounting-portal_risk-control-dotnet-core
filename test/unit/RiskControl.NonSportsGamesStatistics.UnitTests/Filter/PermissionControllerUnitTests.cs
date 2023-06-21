using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models.ValueObject;
using Fanex.NAP.Client.Services;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter
{
    public class PermissionControllerUnitTests
    {
        [Fact]
        public void Query_Permission_ReturnRightPermissions()
        {
            // Arrange
            var fakeModePermissions = new List<FunctionPolicy>
            {
                new()
                {
                    Id = 1938,
                    Key = "HistoryMode",
                    Name = "HistoryMode",
                    Policy = 1
                },
                new()
                {
                    Id = 1937,
                    Key = "NormalMode",
                    Name = "NormalMode",
                    Policy = 1
                }
            };

            var fakeProductPermissions = new List<FunctionPolicy>
            {
                new()
                {
                    Id = 12,
                    Key = "Allbet",
                    Name = "Allbet",
                    Policy = 1
                },
                new()
                {
                    Id = 13,
                    Key = "Keno",
                    Name = "Keno",
                    Policy = 1
                },
                 new()
                 {
                    Id = 14,
                    Key = "Macau",
                    Name = "Macau",
                    Policy = 1
                }
            };

            var expectedPermission = new Permission
            {
                Modes = new List<string>
                {
                    "HistoryMode",
                    "NormalMode"
                },
                Products = new List<string>
                {
                    "Allbet",
                    "Keno",
                    "Macau"
                }
            };

            var userService = Substitute.For<IUserService>();
            userService.GetPermissions(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), "Non_SportGameStatistics_ModePermission").Returns(fakeModePermissions);
            userService.GetPermissions(Arg.Compat.Any<int>(), Arg.Compat.Any<int>(), "Non_SportGameStatistics_ProductPermission").Returns(fakeProductPermissions);

            var napSession = Substitute.For<INapSession>();

            var napSetting = Substitute.For<INapSettings>();

            var controller = new PermissionController(userService, napSession, napSetting);

            // Act
            var actualResult = controller.Query();

            // Assert
            DeepAssert.Equal(actualResult.Modes.ToList(), expectedPermission.Modes);
            DeepAssert.Equal(actualResult.Products.ToList(), expectedPermission.Products);
        }
    }
}

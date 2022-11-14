using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter
{
    public class SiteControllerUnitTests
    {
        [Fact]
        public async Task Query_Site_ReturnSiteItems()
        {
            // Arrange
            var expectedSites = new List<SiteGroupModel>
            {
                new SiteGroupModel {
                    GroupId = 0, GroupName = "Credit Group", LicenseeId = 0, LicenseeName = null,
                    ChildGroups = new List<SiteGroupModel>(),
                    ChildItems = new List<LicenseeModel>()
                },
                new SiteGroupModel {
                    GroupId = 0, GroupName = "Licensee Group", LicenseeId = 0, LicenseeName = null,
                    ChildGroups = new List<SiteGroupModel>(),
                    ChildItems = new List<LicenseeModel>()
                },
            };

            var filterService = Substitute.For<FilterService>();
            filterService.GetSiteGroups(Arg.Compat.Any<string>()).Returns(expectedSites);

            var controller = new SiteController(filterService);

            // Act
            var actualResult = await controller.Query("1,2,3");

            // Assert
            DeepAssert.Equal(actualResult, expectedSites);
        }
    }
}

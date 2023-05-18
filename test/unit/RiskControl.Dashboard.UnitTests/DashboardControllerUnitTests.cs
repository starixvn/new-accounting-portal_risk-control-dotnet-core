using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.Dashboard.Criteria;
using RiskControl.Dashboard.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.Dashboard.UnitTests
{
    public class DashboardControllerUnitTests
    {
        private readonly IDynamicRepository repository;
        private readonly DashboardController dashboardController;

        public DashboardControllerUnitTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            dashboardController = new DashboardController(repository);
        }

        [Fact]
        public async Task TopGameTypeWinning_Always_ReturnExpectedData()
        {
            // Arrang
            repository.FetchAsync<TopGameTypeWinning>(Arg.Compat.Any<TopGameTypeWinningCriteria>()).Returns(TestData.TopGameTypeWinningList);

            // Act
            var actualResults = await dashboardController.TopGameTypeWinning() as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.TopGameTypeWinningList, actualResults.Value);
        }

        [Fact]
        public async Task TopMemberWinning_Always_ReturnExpectedData()
        {
            // Arrang
            repository.FetchAsync<TopMemberWinning>(Arg.Compat.Any<TopMemberWinningCriteria>()).Returns(TestData.TopMemberWinningList);

            // Act
            var actualResults = await dashboardController.TopMemberWinning(false) as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.TopMemberWinningList, actualResults.Value);
        }
    }
}

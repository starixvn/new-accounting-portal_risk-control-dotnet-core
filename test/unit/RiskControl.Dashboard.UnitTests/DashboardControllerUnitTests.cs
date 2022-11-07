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
        public async Task CurrencyNetIncome_Always_ReturnExpectedData()
        {
            // Arrang
            repository.FetchAsync<CurrencyNetIncome>(Arg.Compat.Any<CurrencyNetIncomeCriteria>()).Returns(TestData.CurrencyNetIncomeList);

            // Act
            var actualResults = await dashboardController.CurrencyNetIncome() as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.CurrencyNetIncomeList, actualResults.Value);
        }

        [Fact]
        public async Task MonthlyTurnoverAndNetIncome_Always_ReturnExpectedData()
        {
            // Arrang
            repository.FetchAsync<MonthlyTurnoverAndNetIncome>(Arg.Compat.Any<MonthlyTurnoverAndNetIncomeCriteria>()).Returns(TestData.MonthlyTurnoverAndNetIncomeList);

            // Act
            var actualResults = await dashboardController.MonthlyTurnoverAndNetIncome() as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.MonthlyTurnoverAndNetIncomeList, actualResults.Value);
        }

        [Fact]
        public async Task ProductTurnover_Always_ReturnExpectedData()
        {
            // Arrang
            repository.FetchAsync<ProductTurnover>(Arg.Compat.Any<ProductTurnoverCriteria>()).Returns(TestData.ProductTurnoverList);

            // Act
            var actualResults = await dashboardController.ProductTurnover() as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.ProductTurnoverList, actualResults.Value);
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
            var actualResults = await dashboardController.TopMemberWinning() as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.TopMemberWinningList, actualResults.Value);
        }

        [Fact]
        public async Task WinLossLimit_Always_ReturnExpectedData()
        {
            // Arrang
            repository.FetchAsync<WinLossLimit>(Arg.Compat.Any<WinLossLimitCriteria>()).Returns(TestData.WinLossLimitList);

            // Act
            var actualResults = await dashboardController.WinLossLimit() as OkObjectResult;

            // Assert
            DeepAssert.Equal(TestData.WinLossLimitList, actualResults.Value);
        }
    }
}

using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyViewGrandTotalNormal;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal.DailyViewGrandTotalNormal
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_DailyViewGrandTotalNormalModeWithAnyQueryModel_ReturnRightGridOptions()
        {
            // Arrange
            var fakeDailyReportModel = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-service-data");
            var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
            var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

            var service = Substitute.For<Service<CurrencyViewStatisticsReportModel, Criteria>>();
            service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeDailyReportModel);

            var gridOptionService = Substitute.For<GridOptionBuilderService<CurrencyViewStatisticsReportModel, QueryModel>>();
            gridOptionService.BuildGridOptions(Arg.Compat.Any<CurrencyViewStatisticsReportModel>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

            var handler = new Handler(service, gridOptionService);

            // Act
            var actualResult = await handler.Handle(
               new QueryModel
               {
                   WinLostDate = new DateTime(2017, 1, 1),
                   IsDrillDown = false,
                   IsGrandTotal = false
               },
               new CancellationToken());

            // Assert
            DeepAssert.Equal(actualResult, expectedGridOptions);
        }
    }
}

using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Daily;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.GrandTotal.Daily;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_DailyGrandTotalWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeDailyGrandTotalReportModel = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-service-data", dateTimeFormat: "MMM dd, yyyy");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service<CurrencyViewStatisticsReportModel, HistoryCriteria>>();
        service.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeDailyGrandTotalReportModel);

        var gridOptionService = Substitute.For<GridOptionBuilderService<CurrencyViewStatisticsReportModel, QueryModel>>();
        gridOptionService.BuildGridOptions(Arg.Compat.Any<CurrencyViewStatisticsReportModel>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

        var handler = new Handler(service, gridOptionService);

        // Act
        var actualResult = await handler.Handle(
            new QueryModel
            {
                FromDate = new DateTime(2017, 1, 1),
                ToDate = new DateTime(2017, 3, 1),
                UsernameDrillDown = false
            },
            new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
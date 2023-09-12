using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Daily;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Daily;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_DailyWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeRawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("full-fake-raw-data");
        var fakeCalculationDailyReportModel = TestDataProvider.Load<DailyReportModel>("fake-daily-report-statistic", dateTimeFormat: "MMM dd, yyyy");
        var expectedResult = TestDataProvider.Load<DailyReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<BaseRawStatistic>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeRawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateDailyReport(Arg.Compat.Any<GenericRawData<BaseRawStatistic>>()).Returns(fakeCalculationDailyReportModel);

        var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(actualResult, expectedResult);
    }
}
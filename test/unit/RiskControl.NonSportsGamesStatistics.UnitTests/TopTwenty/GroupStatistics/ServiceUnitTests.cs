using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.GroupStatistics;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_TopTwentyWinnerOrLoserWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<TopTwentyRawStatistics>>("full-fake-raw-data");
        var fakeCalculationTopTwentyGroupReport = TestDataProvider.Load<UserNameViewGroupStatisticsWithTotalModel>("fake-calculation-toptwenty-group-report");
        var expectedResult = TestDataProvider.Load<UserNameViewGroupStatisticsWithTotalModel>("expected-statistic");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<TopTwentyRawStatistics>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateTopTwentyGroupReport(Arg.Compat.Any<GenericRawData<TopTwentyRawStatistics>>()).Returns(fakeCalculationTopTwentyGroupReport);

        var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GroupStatistics;

using Xunit.Asserts.Compare;

public class DeviceServiceUnitTests
{
    [Fact]
    public async Task Query_DeviceWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("full-fake-raw-data");
        var fakeCalculationDeviceReport = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("fake-calculation-device-statistic");
        var expectedResult = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("expected-statistic");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<BaseRawStatistic>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateDeviceReport(Arg.Compat.Any<GenericRawData<BaseRawStatistic>>()).Returns(fakeCalculationDeviceReport);

        var service = new DeviceServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(actualResult, expectedResult);
    }
}
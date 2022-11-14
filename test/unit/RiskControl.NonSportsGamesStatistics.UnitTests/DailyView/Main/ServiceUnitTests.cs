using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Main;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Main
{
    public class ServiceUnitTests
    {
        [Fact]
        public async Task Query_DailyViewWithAnyCriteria_ReturnRightStatistics()
        {
            // Arrange
            var rawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("full-fake-raw-data");
            var fakeCalculationDailyViewReport = TestDataProvider.Load<DailyViewReportModel>("fake-calculation-dailyview-statistic");
            var expectedResult = TestDataProvider.Load<DailyViewReportModel>("expected-statistic");

            var rawService = Substitute.For<RawService>();
            rawService.QueryMultipleData<BaseRawStatistic>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

            var calculationService = Substitute.For<CalculationService>();
            calculationService.CalculateDailyViewReport(Arg.Compat.Any<GenericRawData<BaseRawStatistic>>()).Returns(fakeCalculationDailyViewReport);
            var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

            // Act
            var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

            // Assert
            DeepAssert.Equal(actualResult, expectedResult);
        }
    }
}

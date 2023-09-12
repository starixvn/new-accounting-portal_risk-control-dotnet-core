using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.CurrencyView.GrandTotal;

using Xunit.Asserts.Compare;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_CurrencyGrandTotalWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("full-fake-raw-data");
        var fakeCalculationCurrencyGrandTotalStatistics = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-calculation-currency-grand-total-statistic");
        var expectedResult = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("expected-statistic");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<BaseRawStatistic>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateGrandTotalForDailyAndCurrencyView(Arg.Compat.Any<GenericRawData<BaseRawStatistic>>()).Returns(fakeCalculationCurrencyGrandTotalStatistics);

        var service = new ServiceImp(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(actualResult, expectedResult);
    }
}
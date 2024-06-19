using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;
using RiskControl.NonSportsGamesStatistics.Model;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_DailyViewGrandTotalWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("full-fake-raw-data");
        var fakeCalculationDailyViewGrandTotal = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-calculation-daily-view-grand-total");
        var expectedResult = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("expected-statistic");

        var dataSourceChooser = Substitute.For<DataSourceChooser>();
        dataSourceChooser.GetDataSource(Arg.Compat.Any<bool>()).Returns("Bettrans14");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<BaseRawStatistic>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateGrandTotalForDailyAndCurrencyView(Arg.Compat.Any<GenericRawData<BaseRawStatistic>>()).Returns(fakeCalculationDailyViewGrandTotal);

        var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(actualResult, expectedResult);
    }
}
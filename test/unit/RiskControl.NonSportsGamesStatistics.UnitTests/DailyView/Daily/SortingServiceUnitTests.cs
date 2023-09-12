using RiskControl.NonSportsGamesStatistics.DailyView.Daily;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Daily;

public class SortingServiceUnitTests
{
    [Fact]
    public void SortData_DailyReportSortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightStatistics()
    {
        // Arrange
        var statistics = TestDataProvider.Load<DailyReportModel>("fake-statistics-data", dateTimeFormat: "MMM dd, yyyy");
        var expectedResult = TestDataProvider.Load<DailyReportModel>("expected-statistics-data", dateTimeFormat: "MMM dd, yyyy");
        var service = new SortingServiceImp();

        // Act
        statistics = service.SortData(statistics, "Asc", "BetCount");

        // Assert
        DeepAssert.Equal(statistics, expectedResult);
    }

    [Fact]
    public void SortData_DailyReportSortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightStatistics()
    {
        // Arrange
        var statistics = TestDataProvider.Load<DailyReportModel>("fake-statistics-data", dateTimeFormat: "MMM dd, yyyy");
        var expectedResult = TestDataProvider.Load<DailyReportModel>("expected-statistics-data-desc", dateTimeFormat: "MMM dd, yyyy");
        var service = new SortingServiceImp();

        // Act
        statistics = service.SortData(statistics, "Desc", "BetCount");

        // Assert
        DeepAssert.Equal(statistics, expectedResult);
    }
}
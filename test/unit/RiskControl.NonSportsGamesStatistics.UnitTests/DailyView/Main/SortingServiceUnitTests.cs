using RiskControl.NonSportsGamesStatistics.DailyView.Main;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Main;

using Xunit.Asserts.Compare;

public class SortingServiceUnitTests
{
    [Fact]
    public void SortData_DailyViewReportSortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightStatistics()
    {
        // Arrange
        var statistics = TestDataProvider.Load<DailyViewReportModel>("fake-statistics-data");
        var expectedResult = TestDataProvider.Load<DailyViewReportModel>("expected-statistics-data");
        var service = new SortingServiceImp();

        // Act
        statistics = service.SortData(statistics, "Desc", "TotalBets");

        // Assert
        DeepAssert.Equal(statistics, expectedResult);
    }

    [Fact]
    public void SortData_DailyViewReportSortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightStatistics()
    {
        // Arrange
        var statistics = TestDataProvider.Load<DailyViewReportModel>("fake-statistics-data");
        var expectedResult = TestDataProvider.Load<DailyViewReportModel>("expected-statistics-data-asc");
        var service = new SortingServiceImp();

        // Act
        statistics = service.SortData(statistics, "Asc", "TotalBets");

        // Assert
        DeepAssert.Equal(statistics, expectedResult);
    }
}
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.UserNameView.Main;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.Main;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class SortingServiceUnitTests
{
    [Fact]
    public void SortData_UserNameViewReportSortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightStatistics()
    {
        // Arrange
        var statistics = TestDataProvider.Load<UserNameViewReportModel>("fake-statistics-data");
        var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-statistics-data");
        var service = new SortingServiceImp();

        // Act
        statistics = service.SortData(statistics, "Desc", "TotalBets");

        // Assert
        DeepAssert.Equal(expectedResult, statistics);
    }

    [Fact]
    public void SortData_DailyViewReportSortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightStatistics()
    {
        // Arrange
        var statistics = TestDataProvider.Load<UserNameViewReportModel>("fake-statistics-data");
        var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-statistics-data-asc");
        var service = new SortingServiceImp();

        // Act
        statistics = service.SortData(statistics, "Asc", "TotalBets");

        // Assert
        DeepAssert.Equal(expectedResult, statistics);
    }
}
using RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GroupStatistics
{
    public class SortingServiceUnitTests
    {
        [Fact]
        public void SortData_GroupStatisticReportSortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightStatistics()
        {
            // Arrange
            var statistics = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("fake-statistics-data");
            var expectedResult = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("expected-statistics-data");
            var service = new SortingServiceImp();

            // Act
            statistics = service.SortData(statistics, "Desc", "TotalBets");

            // Assert
            DeepAssert.Equal(statistics, expectedResult);
        }

        [Fact]
        public void SortData_GroupStatisticReportSortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightStatistics()
        {
            // Arrange
            var statistics = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("fake-statistics-data");
            var expectedResult = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("expected-statistics-data-asc");
            var service = new SortingServiceImp();

            // Act
            statistics = service.SortData(statistics, "Asc", "TotalBets");

            // Assert
            DeepAssert.Equal(statistics, expectedResult);
        }
    }
}

using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.VoidRejectRefund.Common;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common
{
    public class SortingServiceUnitTests
    {
        [Fact]
        public void SortData_SortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightData()
        {
            // Arrange
            var sortData = TestDataProvider.Load<StatisticReportModel>("expected-data");

            var expectedData = TestDataProvider.Load<StatisticReportModel>("expected-sort-columname-betcount-sortdirection-asc-data");

            var service = new SortingServiceImp();

            // Act
            var actualResult = service.SortData(sortData, "asc", "BetCount");

            // Assert
            DeepAssert.Equal(expectedData, actualResult);
        }

        [Fact]
        public void SortData_SortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightData()
        {
            // Arrange
            var sortData = TestDataProvider.Load<StatisticReportModel>("expected-data");

            var expectedData = TestDataProvider.Load<StatisticReportModel>("expected-sort-columname-betcount-sortdirection-desc-data");

            var service = new SortingServiceImp();

            // Act
            var actualResult = service.SortData(sortData, "desc", "BetCount");

            // Assert
            DeepAssert.Equal(expectedData, actualResult);
        }

        [Fact]
        public void SortData_SortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightGroupData()
        {
            // Arrange
            var sortData = TestDataProvider.Load<GroupStatisticReportModel>("expected-group-data");

            var expectedData = TestDataProvider.Load<GroupStatisticReportModel>("expected-sort-columname-betcount-sortdirection-asc-group-data");

            var service = new SortingGroupServiceImp();

            // Act
            var actualResult = service.SortData(sortData, "asc", "BetCount");

            // Assert
            DeepAssert.Equal(expectedData, actualResult);
        }

        [Fact]
        public void SortData_SortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightGroupData()
        {
            // Arrange
            var sortData = TestDataProvider.Load<GroupStatisticReportModel>("expected-group-data");

            var expectedData = TestDataProvider.Load<GroupStatisticReportModel>("expected-sort-columname-betcount-sortdirection-desc-group-data");

            var service = new SortingGroupServiceImp();

            // Act
            var actualResult = service.SortData(sortData, "desc", "BetCount");

            // Assert
            DeepAssert.Equal(expectedData, actualResult);
        }
    }
}

using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.VoidRejectRefund.Product;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Product;

using Xunit.Asserts.Compare;

public class ProductSortingServiceUnitTests
{
    [Fact]
    public void SortData_SortColumnNameIsBetCountAndSortDirectionIsAscending_ReturnRightData()
    {
        // Arrange
        var sortData = TestDataProvider.Load<ProductModel>("expected-data");

        var expectedData = TestDataProvider.Load<ProductModel>("expected-sort-columname-betcount-sortdirection-asc-data");

        var service = new ProductSortingServiceImp();

        // Act
        var actualResult = service.SortData(sortData, "asc", "BetCount");

        // Assert
        DeepAssert.Equal(expectedData, actualResult);
    }

    [Fact]
    public void SortData_SortColumnNameIsBetCountAndSortDirectionIsDescending_ReturnRightData()
    {
        // Arrange
        var sortData = TestDataProvider.Load<ProductModel>("expected-data");

        var expectedData = TestDataProvider.Load<ProductModel>("expected-sort-columname-betcount-sortdirection-desc-data");

        var service = new ProductSortingServiceImp();

        // Act
        var actualResult = service.SortData(sortData, "desc", "BetCount");

        // Assert
        DeepAssert.Equal(expectedData, actualResult);
    }
}
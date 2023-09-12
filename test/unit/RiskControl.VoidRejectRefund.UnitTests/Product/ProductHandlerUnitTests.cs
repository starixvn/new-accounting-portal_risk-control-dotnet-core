using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Product;

using Xunit.Asserts.Compare;

public class ProductHandlerUnitTests
{
    [Fact]
    public async Task Handle_ParameterWithSortDirectionAndSortColumnNameIsEmpty_ReturnRightProductModel()
    {
        // Arrange
        var expectedProductModel = TestDataProvider.Load<ProductModel>("product-model");
        var expectedSortModel = TestDataProvider.Load<ProductModel>("product-model");

        var service = Substitute.For<ProductService>();
        service.Query(Arg.Compat.Any<HttpParameterJsonBase>()).Returns(expectedProductModel);

        var sortingService = Substitute.For<SortingService<ProductModel>>();
        sortingService.SortData(Arg.Compat.Any<ProductModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(expectedSortModel);

        var handler = new ProductHandler(service, sortingService);

        // Act
        var actualResult = await handler.Handle(new VoidRejectRefund.Product.HttpParameterJson(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedProductModel, actualResult);
    }

    [Fact]
    public async Task Handle_ParameterWithSortDirectionAndSortColumnNameIsNotEmpty_ReturnRightProductModel()
    {
        // Arrange
        var expectedProductModel = TestDataProvider.Load<ProductModel>("product-model");
        var expectedSortModel = TestDataProvider.Load<ProductModel>("sorted-asc-betcount-product-model");

        var service = Substitute.For<ProductService>();
        service.Query(Arg.Compat.Any<HttpParameterJsonBase>()).Returns(expectedProductModel);

        var sortingService = Substitute.For<SortingService<ProductModel>>();
        sortingService.SortData(Arg.Compat.Any<ProductModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(expectedSortModel);

        var handler = new ProductHandler(service, sortingService);

        // Act
        var actualResult = await handler.Handle(
            new VoidRejectRefund.Product.HttpParameterJson
            {
                SortDirection = "asc",
                SortColumnName = "BetCount"
            },
            new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedSortModel, actualResult);
    }
}
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter;

public class ProductControllerUnitTests
{
    [Fact]
    public async Task Query_Product_ReturnProductItems()
    {
        // Arrange
        var fakeProducts = new List<ProductModel>
        {
            new() { ProductId = 1, ProductName = "Any product name 1", CasinoType = 0, IsSingleWallet = false },
            new() { ProductId = 2, ProductName = "Any product name 2", CasinoType = 1, IsSingleWallet = true }
        };

        var expectedProducts = new List<ProductModel>
        {
            new() { ProductId = 1, ProductName = "Any product name 1", CasinoType = 0, IsSingleWallet = false },
            new() { ProductId = 2, ProductName = "Any product name 2", CasinoType = 1, IsSingleWallet = true }
        };

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<ProductModel>(Arg.Compat.Any<ProductCriteria>()).Returns(fakeProducts);

        var controller = new ProductController(repository);

        // Act
        var actualResult = await controller.Query();

        // Assert
        DeepAssert.Equal(actualResult, expectedProducts);
    }
}
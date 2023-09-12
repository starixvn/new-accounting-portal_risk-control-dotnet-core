using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Product;

public class ProductServiceUnitTests
{
    [Fact]
    public async Task Query_RepositoryReturnHasData_ReturnRightData()
    {
        // Arrange
        var fakeBodyData = TestDataProvider.Load<IEnumerable<ProductLeagueSportBettypeEntity>>("fake-body-data");
        var fakeGrandTotalData = TestDataProvider.Load<IEnumerable<ProductLeagueSportBettypeEntity>>("fake-grand-total-data");
        var expectedData = TestDataProvider.Load<ProductModel>("expected-data");

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchMultipleAsync<ProductLeagueSportBettypeEntity, ProductLeagueSportBettypeEntity>(Arg.Compat.Any<Criteria>()).Returns((fakeBodyData, fakeGrandTotalData));

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<HttpParameterJsonBase, Criteria>();
            cf.CreateMap<ProductLeagueSportBettypeEntity, ProductLeagueSportBettypeStatistic>();
        }).CreateMapper();

        var service = new ProductServiceImp(repository, mapper);

        // Act
        var actualResult = await service.Query(new HttpParameterJsonBase());

        // Assert
        DeepAssert.Equal(expectedData, actualResult);
    }
}
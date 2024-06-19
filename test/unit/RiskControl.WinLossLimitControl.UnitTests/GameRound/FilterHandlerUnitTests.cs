using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class FilterHandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnExpectedData()
    {
        // Arrange
        var expectedData = TestDataProvider.Load<IEnumerable<ProductGameTypeModel>>("product-game-type-model");
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<ProductGameTypeModel>(Arg.Compat.Any<ProductGameTypeCriteria>()).Returns(expectedData);

        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<ProductGameTypeRequest, ProductGameTypeCriteria>();
        }).CreateMapper();

        var handler = new FilterHandler(repository, mapper);

        // Act
        var actualResult = await handler.Handle(new ProductGameTypeRequest(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedData, actualResult);
    }
}
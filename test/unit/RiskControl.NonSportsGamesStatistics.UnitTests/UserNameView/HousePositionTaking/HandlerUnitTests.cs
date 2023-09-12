using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.HousePositionTaking;

using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_HousePositionTakingWithAnyQueryModel_ReturnRightHousePositionTakingModel()
    {
        // Arrange
        var expectedResult = new List<HousePositionTakingModel>
        {
            new() { HousePositionTaking = 0.5m, Product = "Product 1" },
            new() { HousePositionTaking = 0.3m, Product = "Product 2" }
        };

        var dataSourceChooser = Substitute.For<DataSourceChooser>();
        dataSourceChooser.GetDataSource(Arg.Compat.Any<bool>()).Returns("WH");

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<HousePositionTakingModel>(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<CancellationToken>()).Returns(expectedResult);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<QueryModel, Criteria>();
        }).CreateMapper();

        var handler = new Handler(dataSourceChooser, repository, mapper);

        // Act
        var actualResult = await handler.Handle(new QueryModel(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
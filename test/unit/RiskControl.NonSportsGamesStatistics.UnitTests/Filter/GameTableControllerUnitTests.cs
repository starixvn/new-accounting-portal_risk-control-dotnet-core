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

public class GameTableControllerUnitTests
{
    [Fact]
    public async Task Query_GameTable_ReturnGameTableItems()
    {
        // Arrange
        var expectedGameTables = new List<GameTableModel>
        {
            new() { GameTableId = 1, GameTable = "Any game table 1", TypeId = 1, IsTest = true },
            new() { GameTableId = 2, GameTable = "Any game table 2", TypeId = 2, IsTest = false }
        };

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<GameTableModel>(Arg.Compat.Any<GameTableCriteria>()).Returns(expectedGameTables);

        var controller = new GameTableController(repository);

        // Act
        var actualResult = await controller.Query();

        // Assert
        DeepAssert.Equal(actualResult, expectedGameTables);
    }
}
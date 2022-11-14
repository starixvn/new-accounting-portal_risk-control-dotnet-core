using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter
{
    public class GameTypeControllerUnitTests
    {
        [Fact]
        public async Task Query_GameType_ReturnGameTypeItems()
        {
            // Arrange
            var expectedGameTypes = new List<GameTypeModel>
            {
               new GameTypeModel { ProductId = 1, TypeName = "Any game type 1", TypeId = 1, IsTest = true },
               new GameTypeModel { ProductId = 2, TypeName = "Any game type 2", TypeId = 2, IsTest = false }
            };

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<GameTypeModel>(Arg.Compat.Any<GameTypeCriteria>()).Returns(expectedGameTypes);

            var controller = new GameTypeController(repository);

            // Act
            var actualResult = await controller.Query();

            // Assert
            DeepAssert.Equal(actualResult, expectedGameTypes);
        }
    }
}

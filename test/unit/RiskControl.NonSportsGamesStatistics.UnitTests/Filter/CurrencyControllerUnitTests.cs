using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter
{
    public class CurrencyControllerUnitTests
    {
        [Fact]
        public async Task Query_GameType_ReturnGameTypeItems()
        {
            // Arrange
            var expectedCurrencies = new List<CurrencyModel>
             {
                new CurrencyModel { ExchangeId = 2, Currency = "Any currency 1" },
                new CurrencyModel { ExchangeId = 1, Currency = "currency 2" }
            };

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CurrencyModel>(Arg.Compat.Any<CurrencyCriteria>()).Returns(expectedCurrencies);

            var controller = new CurrencyController(repository);

            // Act
            var actualResult = await controller.Query(new CurrencyCriteria());

            // Assert
            DeepAssert.Equal(actualResult.ToList(), expectedCurrencies);
        }
    }
}

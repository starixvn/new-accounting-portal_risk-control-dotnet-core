using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.BettingMonitoring.Models;
using RiskControl.BettingMonitoring.Query;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.BettingMonitoring.UnitTests.Query;

public class QueryServiceUnitTests
{
    [Fact]
    public async Task Execute_Always_ReturnsDataFromRepository()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var rawData = new[]
        {
            new RawSelectModel { SettingName = "MinimumTickets", Value = "25" },
            new RawSelectModel { SettingName = "Threshold", Value = "25" }
        };
        repository.FetchAsync<RawSelectModel>(Arg.Compat.Any<ICriteria>()).Returns(rawData);

        // Act
        var service = new QueryServiceImp(repository);
        var actualResults = await service.Execute();

        // Assert
        var expectedList = new BettingMonitoringModel
        {
            MinimumTickets = 25,
            Threshold = 25
        };
        Assert.Equal(expectedList, actualResults);
    }
}
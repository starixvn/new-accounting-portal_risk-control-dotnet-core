using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound;

using Xunit.Asserts.Compare;

public class BetLimitMonitorDataServiceUnitTests
{
    [Fact]
    public async Task Query_Always_ReturnExpectedData()
    {
        // Arrange
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        dynamicRepository.FetchAsync<BetLimitMonitorModel>(Arg.Compat.Any<ICriteria>()).Returns(FakeBetLimitMonitors);

        var service = new BetLimitMonitorDataServiceImp(dynamicRepository);

        // Act
        var monitorModels = await service.Query(new BetLimitMonitorQueryCriteria());

        // Assert
        DeepAssert.Equal(monitorModels, ExpectedBetLimitMonitors);
    }

    private static IEnumerable<BetLimitMonitorModel> FakeBetLimitMonitors
    {
        get
        {
            var settings = new List<BetLimitMonitorModel>();
            var setting1 = new BetLimitMonitorModel
            {
                BetType = 1,
                BetTypeName = "Bet Type 1",
                ProductId = 1,
                ProductName = "Product 1",
                SportType = 1,
                BetCount = 1,
                NoOfPlayers = 1,
                GameRound = "Game Ground 1",
                GameRoundBetLimit = 1000,
                TotalStake = 1000,
                ReachedLimitTime = new DateTime(2000, 1, 1)
            };
            settings.Add(setting1);

            return settings;
        }
    }

    private static IEnumerable<BetLimitMonitorModel> ExpectedBetLimitMonitors
    {
        get
        {
            var settings = new List<BetLimitMonitorModel>();
            var setting1 = new BetLimitMonitorModel
            {
                Index = 1,
                BetType = 1,
                BetTypeName = "Bet Type 1",
                ProductId = 1,
                ProductName = "Product 1",
                SportType = 1,
                BetCount = 1,
                NoOfPlayers = 1,
                GameRound = "Game Ground 1",
                GameRoundBetLimit = 1000,
                TotalStake = 1000,
                ReachedLimitTime = new DateTime(2000, 1, 1)
            };
            settings.Add(setting1);

            return settings;
        }
    }
}
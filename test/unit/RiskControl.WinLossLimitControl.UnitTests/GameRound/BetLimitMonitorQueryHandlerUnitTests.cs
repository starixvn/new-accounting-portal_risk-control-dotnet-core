using AutoMapper;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound;

public class BetLimitMonitorQueryHandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnExpectedData()
    {
        // Arrange
        var expectedBetLimitMonitorModelList = TestDataProvider.Load<List<BetLimitMonitorModel>>("bet-limit-monitor-model");

        var betLimitMonitorDataService = Substitute.For<BetLimitMonitorDataService>();
        betLimitMonitorDataService.Query(Arg.Compat.Any<BetLimitMonitorQueryCriteria>()).Returns(expectedBetLimitMonitorModelList);

        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<BetLimitMonitorQueryRequest, BetLimitMonitorQueryCriteria>();
        }).CreateMapper();

        var handle = new BetLimitMonitorQueryHandler(betLimitMonitorDataService, mapper);

        // Act
        var actualResult = await handle.Handle(new BetLimitMonitorQueryRequest(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedBetLimitMonitorModelList, actualResult);
    }
}
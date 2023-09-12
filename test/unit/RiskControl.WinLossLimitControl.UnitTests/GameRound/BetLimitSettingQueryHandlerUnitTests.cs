using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound;

using Xunit.Asserts.Compare;

public class BetLimitSettingQueryHandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnExpectedData()
    {
        // Arrange
        var expectedBetLimitSettingModelList = TestDataProvider.Load<List<BetLimitSettingModel>>("bet-limit-setting-model");

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<BetLimitSettingModel>(Arg.Compat.Any<BetLimitSettingQueryCriteria>(), Arg.Compat.Any<CancellationToken>()).Returns(expectedBetLimitSettingModelList);

        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<BetLimitSettingQueryRequest, BetLimitSettingQueryCriteria>();
        }).CreateMapper();

        var handle = new BetLimitSettingQueryHandler(repository, mapper);

        // Act
        var actualResult = await handle.Handle(new BetLimitSettingQueryRequest(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedBetLimitSettingModelList, actualResult);
    }
}
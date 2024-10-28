using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Request;
using RiskControl.WinLossLimitControl.Services;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound;

using Configuration;
using Fanex.NAP.Client.Helpers.Business;

public class GameRoundBetLimitControllerUnitTests
{
    private readonly IMediator mediator;

    private readonly GameRoundBetLimitController controller;

    public GameRoundBetLimitControllerUnitTests()
    {
        mediator = Substitute.For<IMediator>();
        var authorizationService = Substitute.For<AuthorizationService>();
        authorizationService.HasPermission(Arg.Compat.Any<string>(), Arg.Compat.Any<Constant.Policy>()).Returns(true);
        var configurationService = Substitute.For<ConfigurationService>();
        controller = new GameRoundBetLimitController(mediator, authorizationService, configurationService);
    }

    [Fact]
    public async Task SettingQueryAsync_Always_CallMediatorSend()
    {
        // Arrange
        // Act
        await controller.SettingQueryAsync(new BetLimitSettingQueryRequest());

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<BetLimitSettingQueryRequest>());
    }

    [Fact]
    public async Task SettingUpdateAsync_Always_CallMediatorSend()
    {
        // Arrange
        // Act
        await controller.SettingUpdateAsync(new BetLimitSettingUpdateRequest());

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<BetLimitSettingUpdateRequest>());
    }

    [Fact]
    public async Task ProductGameType_Always_CallMediatorSend()
    {
        // Arrange
        // Act
        await controller.ProductGameType();

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<ProductGameTypeRequest>());
    }

    [Fact]
    public async Task MonitorExcelAsync_Always_CallMediatorSend()
    {
        // Arrange
        // Act
        await controller.MonitorExcelAsync(new BetLimitMonitorQueryExcelRequest());

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<BetLimitMonitorQueryExcelRequest>());
    }

    [Fact]
    public async Task MonitorAsync_Always_CallMediatorSend()
    {
        // Arrange
        // Act
        await controller.MonitorAsync(new BetLimitMonitorQueryRequest());

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<BetLimitMonitorQueryRequest>());
    }

    [Fact]
    public void HasHostPermission_Always_ReturnTrue()
    {
        // Arrange
        // Act
        var actualResult = controller.HasHostPermission() as OkObjectResult;

        // Assert
        Assert.True((bool)actualResult.Value);
    }
}
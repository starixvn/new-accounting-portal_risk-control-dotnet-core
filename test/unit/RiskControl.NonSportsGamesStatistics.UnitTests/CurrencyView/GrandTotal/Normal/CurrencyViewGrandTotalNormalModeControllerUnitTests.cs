using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.Normal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.CurrencyView.GrandTotal.Normal;

public class CurrencyViewGrandTotalNormalModeControllerUnitTests
{
    [Fact]
    public async Task Query_GrandTotalNormalModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new CurrencyViewGrandTotalNormalModeController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_GrandTotalNormalModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new CurrencyViewGrandTotalNormalModeController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
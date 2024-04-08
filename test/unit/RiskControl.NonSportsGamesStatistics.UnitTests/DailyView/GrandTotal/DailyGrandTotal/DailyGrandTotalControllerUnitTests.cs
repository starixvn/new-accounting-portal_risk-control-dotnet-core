using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyGrandTotal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal.DailyGrandTotal;

public class DailyGrandTotalControllerUnitTests
{
    [Fact]
    public async Task Query_DailyGrandTotalAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new DailyGrandTotalController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_DailyGrandTotalAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new DailyGrandTotalController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyViewGrandTotal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal.DailyViewGrandTotal;

public class DailyViewGrandTotalControllerUnitTests
{
    [Fact]
    public async Task Query_DailyViewGrandTotalAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new DailyViewGrandTotalController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_DailyViewGrandTotalHistoryModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new DailyViewGrandTotalController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
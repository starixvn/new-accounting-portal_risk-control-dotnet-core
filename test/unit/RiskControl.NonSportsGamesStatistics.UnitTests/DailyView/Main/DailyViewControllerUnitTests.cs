using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.Main;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Main;

public class DailyViewControllerUnitTests
{
    [Fact]
    public async Task Query_MainAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new DailyViewController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_MainAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new DailyViewController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
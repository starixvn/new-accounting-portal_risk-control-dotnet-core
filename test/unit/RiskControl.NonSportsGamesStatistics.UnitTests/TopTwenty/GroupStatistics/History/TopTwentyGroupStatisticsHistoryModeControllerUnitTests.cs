using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.GroupStatistics.History;

public class TopTwentyGroupStatisticsHistoryModeControllerUnitTests
{
    [Fact]
    public async Task Query_TopTwentyGroupStatisticsHistoryModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new TopTwentyGroupStatisticsHistoryModeController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_TopTwentyGroupStatisticsHistoryModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new TopTwentyGroupStatisticsHistoryModeController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
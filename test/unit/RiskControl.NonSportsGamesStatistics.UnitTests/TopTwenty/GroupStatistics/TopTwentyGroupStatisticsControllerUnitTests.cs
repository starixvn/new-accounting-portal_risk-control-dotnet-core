using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.GroupStatistics;

public class TopTwentyGroupStatisticsControllerUnitTests
{
    [Fact]
    public async Task Query_TopTwentyGroupStatisticsAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new TopTwentyGroupStatisticsController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_TopTwentyGroupStatisticsAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new TopTwentyGroupStatisticsController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
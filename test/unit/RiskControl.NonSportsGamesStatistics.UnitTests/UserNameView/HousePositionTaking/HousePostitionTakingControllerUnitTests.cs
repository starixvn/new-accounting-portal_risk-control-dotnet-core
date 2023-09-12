using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.HousePositionTaking;

public class HousePostitionTakingControllerUnitTests
{
    [Fact]
    public async Task Query_HousePositionTakingAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new HousePostitionTakingController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(queryModel);
    }
}
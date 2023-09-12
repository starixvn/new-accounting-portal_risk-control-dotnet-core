using MediatR;
using NSubstitute;
using RiskControl.BettingMonitoring.Update;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.BettingMonitoring.UnitTests.Update;

public class BettingMonitoringUpdateControllerUnitTests
{
    [Fact]
    public async Task Update_BetMonitoringModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();

        // Act
        var controller = new BettingMonitoringUpdateController(mediator);
        var message = new Message
        {
            MinimumTickets = 25,
            Threshold = 25
        };
        await controller.Update(message);

        // Assert
        await mediator.Received().Send(message);
    }
}
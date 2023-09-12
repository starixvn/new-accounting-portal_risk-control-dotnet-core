using MediatR;
using NSubstitute;
using RiskControl.BettingMonitoring.Query;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.BettingMonitoring.UnitTests.Query;

public class BettingMonitoringQueryControllerUnitTests
{
    [Fact]
    public async Task Query_BetMonitoringModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();

        // Act
        var message = new Message();
        var controller = new BettingMonitoringQueryController(mediator);
        await controller.Query(message);

        // Assert
        await mediator.Received().Send(message);
    }
}
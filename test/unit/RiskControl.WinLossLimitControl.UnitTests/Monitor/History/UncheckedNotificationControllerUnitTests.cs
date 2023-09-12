using MediatR;
using NSubstitute;
using RiskControl.WinLossLimitControl.Monitor.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.History;

public class UncheckedNotificationControllerUnitTests
{
    [Fact]
    public async Task UncheckNotification_Always_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var request = new RequestUncheckedNotification();

        // Act
        var controller = new UncheckedNotificationController(mediator);
        await controller.UncheckNotification(request);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<RequestUncheckedNotification>());
    }
}
using MediatR;
using NSubstitute;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update;

public class CurrencySettingUpdateControllerUnitTests
{
    [Fact]
    public async Task Post_ParameterWithRequest_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();

        // Act
        var controller = new CurrencySettingUpdateController(mediator);
        await controller.Post(new Request());

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<Request>());
    }

    [Fact]
    public async Task Post_ParameterWithUpdateInactiveSiteRequest_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();

        // Act
        var controller = new CurrencySettingUpdateController(mediator);
        await controller.Post(new UpdateInactiveSiteRequest());

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<UpdateInactiveSiteRequest>());
    }
}
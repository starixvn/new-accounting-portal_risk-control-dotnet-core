using MediatR;
using NSubstitute;
using RiskControl.VoidRejectRefund.Product;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Product;

public class ProductModeControllerUnitTests
{
    [Fact]
    public async Task Index_Always_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var httpParameter = new HttpParameterJson();

        // Act
        var controller = new ProductModeController(mediator);
        await controller.Index(httpParameter);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<HttpParameterJson>());
    }

    [Fact]
    public async Task Excel_Always_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var httpParameterExcel = new HttpParameterExcel();

        // Act
        var controller = new ProductModeController(mediator);
        await controller.Excel(httpParameterExcel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<HttpParameterExcel>());
    }
}
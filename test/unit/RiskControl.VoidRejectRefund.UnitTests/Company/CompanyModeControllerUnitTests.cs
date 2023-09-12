using MediatR;
using NSubstitute;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Company;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Company;

public class CompanyModeControllerUnitTests
{
    [Fact]
    public async Task Index_Always_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var httpParameter = new HttpParameterGroupJson();

        // Act
        var controller = new CompanyModeController(mediator);
        await controller.Index(httpParameter);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<HttpParameterGroupJson>());
    }

    [Fact]
    public async Task Excel_Always_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var httpParameterExcel = new HttpParameterGroupExcel();

        // Act
        var controller = new CompanyModeController(mediator);
        await controller.Excel(httpParameterExcel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<HttpParameterGroupExcel>());
    }
}
using MediatR;
using NSubstitute;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Monthly;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Monthly
{
    public class MonthlyModeControllerUnitTests
    {
        [Fact]
        public async Task Index_Always_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var httpParameter = new HttpParameterJson();

            // Act
            var controller = new MonthlyModeController(mediator);
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
            var controller = new MonthlyModeController(mediator);
            await controller.Excel(httpParameterExcel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<HttpParameterExcel>());
        }
    }
}

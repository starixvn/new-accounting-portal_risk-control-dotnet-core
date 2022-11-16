using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Hourly.Normal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Hourly.Normal
{
    public class HourlyNormalModeControllerUnitTests
    {
        [Fact]
        public async Task Query_NormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new HourlyNormalModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_NormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModelExcel();

            // Act
            var controller = new HourlyNormalModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModelExcel>());
        }
    }
}

using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Hourly.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Hourly.History
{
    public class HourlyHistoryModeControllerUnitTests
    {
        [Fact]
        public async Task Query_HistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new HourlyHistoryModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_HistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModelExcel();

            // Act
            var controller = new HourlyHistoryModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModelExcel>());
        }
    }
}

using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.DailyGrandTotalNormal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal.DailyGrandTotalNormal
{
    public class DailyGrandTotalNormalModeControllerUnitTests
    {
        [Fact]
        public async Task Query_DailyGrandTotalNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new DailyGrandTotalNormalModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_DailyGrandTotalNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new DailyGrandTotalNormalModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

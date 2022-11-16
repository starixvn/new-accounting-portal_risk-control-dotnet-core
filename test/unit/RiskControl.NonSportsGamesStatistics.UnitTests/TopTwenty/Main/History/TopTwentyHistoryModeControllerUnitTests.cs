using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.TopTwenty.Main.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.Main.History
{
    public class TopTwentyHistoryModeControllerUnitTests
    {
        [Fact]
        public async Task Query_MainTopTwentyHistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new TopTwentyHistoryModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_MainTopTwentyHistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new TopTwentyHistoryModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

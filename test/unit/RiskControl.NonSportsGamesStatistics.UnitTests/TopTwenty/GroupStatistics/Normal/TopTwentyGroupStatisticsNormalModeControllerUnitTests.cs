using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics.Normal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.GroupStatistics.Normal
{
    public class TopTwentyGroupStatisticsNormalModeControllerUnitTests
    {
        [Fact]
        public async Task Query_TopTwentyGroupStatisticsNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new TopTwentyGroupStatisticsNormalModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_TopTwentyGroupStatisticsNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new TopTwentyGroupStatisticsNormalModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

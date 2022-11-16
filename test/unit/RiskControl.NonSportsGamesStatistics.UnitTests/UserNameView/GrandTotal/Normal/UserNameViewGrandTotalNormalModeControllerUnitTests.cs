using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal.Normal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.GrandTotal.Normal
{
    public class UserNameViewGrandTotalNormalModeControllerUnitTests
    {
        [Fact]
        public async Task Query_GrandTotalNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new UserNameViewGrandTotalNormalModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_GrandTotalNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new UserNameViewGrandTotalNormalModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

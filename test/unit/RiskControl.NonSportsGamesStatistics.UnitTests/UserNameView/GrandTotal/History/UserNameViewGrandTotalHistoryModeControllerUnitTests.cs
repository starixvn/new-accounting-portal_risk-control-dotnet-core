using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.GrandTotal.History
{
    public class UserNameViewGrandTotalHistoryModeControllerUnitTests
    {
        [Fact]
        public async Task Query_GrandTotalHistoryAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new UserNameViewGrandTotalHistoryModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_GrandTotalHistoryAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new UserNameViewGrandTotalHistoryModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

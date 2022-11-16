using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.AssociatedAccount.History
{
    public class AssociatedAccountHistoryModeControllerUnitTests
    {
        [Fact]
        public async Task Query_AssociatedAccountHistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new AssociatedAccountHistoryModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_AssociatedAccountHistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new AssociatedAccountHistoryModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

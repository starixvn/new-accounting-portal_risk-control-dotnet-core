using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.History;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.CurrencyView.GrandTotal.History
{
    public class CurrencyViewGrandTotalHistoryModeControllerUnitTests
    {
        [Fact]
        public async Task Query_GrandTotalHistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new CurrencyViewGrandTotalHistoryModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_GrandTotalHistoryModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new CurrencyViewGrandTotalHistoryModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.ProductGrandTotalNormal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal.ProductGrandTotalNormal
{
    public class ProductGrandTotalNormalModeControllerUnitTests
    {
        [Fact]
        public async Task Query_ProductGrandTotalNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new ProductGrandTotalNormalModeController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_ProductGrandTotalNormalModeAlways_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new ProductGrandTotalNormalModeController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

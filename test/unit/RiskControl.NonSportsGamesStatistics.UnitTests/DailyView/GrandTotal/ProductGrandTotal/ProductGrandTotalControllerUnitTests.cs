using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.ProductGrandTotal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal.ProductGrandTotal;

public class ProductGrandTotalControllerUnitTests
{
    [Fact]
    public async Task Query_ProductGrandTotalAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new ProductGrandTotalController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_ProductGrandTotalAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new ProductGrandTotalController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
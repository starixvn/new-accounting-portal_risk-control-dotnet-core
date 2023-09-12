using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Product;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.GrandTotal.Product;

public class SpecificMemberProductGrandTotalControllerUnitTests
{
    [Fact]
    public async Task Query_ProductGrandTotalWithQueryModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new SpecificMemberProductGrandTotalController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_ProductGrandTotalWithQueryModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new SpecificMemberProductGrandTotalController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
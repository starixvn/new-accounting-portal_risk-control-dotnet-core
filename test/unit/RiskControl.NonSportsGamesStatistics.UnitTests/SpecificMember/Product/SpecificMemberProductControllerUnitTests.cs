using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Product;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Product;

public class SpecificMemberProductControllerUnitTests
{
    [Fact]
    public async Task Query_ProductWithQueryModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new SpecificMemberProductController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_ProductWithQueryModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel { ReportBy = "SpecificMemberProduct" };

        // Act
        var controller = new SpecificMemberProductController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
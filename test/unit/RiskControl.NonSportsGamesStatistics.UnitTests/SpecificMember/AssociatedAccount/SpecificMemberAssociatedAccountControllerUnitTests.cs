using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.AssociatedAccount;

public class SpecificMemberAssociatedAccountControllerUnitTests
{
    [Fact]
    public async Task Query_AssociatedAccountWithQueryModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new SpecificMemberAssociatedAccountController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_AssociatedAccountWithQueryModel_AlwaysCallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new SpecificMemberAssociatedAccountController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
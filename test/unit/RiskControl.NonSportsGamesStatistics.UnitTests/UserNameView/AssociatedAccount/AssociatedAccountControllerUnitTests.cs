using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.AssociatedAccount;

public class AssociatedAccountControllerUnitTests
{
    [Fact]
    public async Task Query_AssociatedAccountAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new AssociatedAccountController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_AssociatedAccountAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new AssociatedAccountController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
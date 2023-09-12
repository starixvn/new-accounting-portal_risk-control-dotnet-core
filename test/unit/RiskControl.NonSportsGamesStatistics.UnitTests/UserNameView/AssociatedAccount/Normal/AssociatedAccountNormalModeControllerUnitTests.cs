using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.Normal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.AssociatedAccount.Normal;

public class AssociatedAccountNormalModeControllerUnitTests
{
    [Fact]
    public async Task Query_AssociatedAccountNormalModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new AssociatedAccountNormalModeController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_AssociatedAccountNormalModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new AssociatedAccountNormalModeController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
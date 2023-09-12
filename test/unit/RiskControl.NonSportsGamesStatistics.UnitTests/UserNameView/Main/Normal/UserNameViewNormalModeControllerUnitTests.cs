using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.Main.Normal;

public class UserNameViewNormalModeControllerUnitTests
{
    [Fact]
    public async Task Query_MainNormalModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new UserNameViewNormalModeController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_MainNormalModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModelExcel();

        // Act
        var controller = new UserNameViewNormalModeController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModelExcel>());
    }
}
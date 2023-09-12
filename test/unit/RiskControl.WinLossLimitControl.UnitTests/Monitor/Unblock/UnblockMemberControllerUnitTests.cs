using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock;

using Xunit.Asserts.Compare;

public class UnblockMemberControllerUnitTests
{
    [Fact]
    public async Task UnblockTransfer_Always_ReturnsResultFromMediator()
    {
        // Arrange
        var executeResult = new ExecuteResult();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Compat.Any<RequestUnblockTransfer>()).Returns(executeResult);

        // Act
        var controller = new UnblockMemberController(mediator);
        var actionResult = await controller.UnblockTransfer(new RequestUnblockTransfer()) as OkObjectResult;

        // Assert
        DeepAssert.Equal(actionResult.Value, executeResult);
    }

    [Fact]
    public async Task UnblockPlaceBet_Always_ReturnsResultFromMediator()
    {
        // Arrange
        var executeResult = new ExecuteResult();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Compat.Any<RequestUnblockPlaceBet>()).Returns(executeResult);

        // Act
        var controller = new UnblockMemberController(mediator);
        var actionResult = await controller.UnblockPlaceBet(new RequestUnblockPlaceBet()) as OkObjectResult;

        // Assert
        DeepAssert.Equal(actionResult.Value, executeResult);
    }
}
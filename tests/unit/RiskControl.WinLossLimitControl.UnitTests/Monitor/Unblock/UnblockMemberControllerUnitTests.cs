using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock
{
    public class UnblockMemberControllerUnitTests
    {
        [Fact]
        public async Task UnblockTransfer_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var executeResult = new ExecuteResult();
            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<RequestUnblockTransfer>()).Returns(executeResult);

            // Act
            var controller = new UnblockMemberController(mediator);
            var actionResult = await controller.UnblockTransfer(new RequestUnblockTransfer());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, executeResult);
        }

        [Fact]
        public async Task UnblockPlaceBet_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var executeResult = new ExecuteResult();
            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<RequestUnblockPlaceBet>()).Returns(executeResult);

            // Act
            var controller = new UnblockMemberController(mediator);
            var actionResult = await controller.UnblockPlaceBet(new RequestUnblockPlaceBet());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, executeResult);
        }
    }
}
using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.Monitor.History;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.History;

public class MonitorHistoryControllerUnitTests
{
    [Fact]
    public async Task Post_Always_ReturnsResultFromMediator()
    {
        // Arrange
        var history = new List<WinLimitHistory>();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Compat.Any<Request>()).Returns(history);

        // Act
        var controller = new MonitorHistoryController(mediator);
        var actionResult = await controller.Post(new Request()) as OkObjectResult;

        // Assert
        DeepAssert.Equal(history, actionResult.Value);
    }
}
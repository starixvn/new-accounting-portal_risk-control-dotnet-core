using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.History;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.History
{
    public class MonitorHistoryControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var history = new List<WinLimitHistory>();
            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<Request>()).Returns(history);

            // Act
            var controller = new MonitorHistoryController(mediator);
            var actionResult = await controller.Post(new Request());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, history);
        }
    }
}
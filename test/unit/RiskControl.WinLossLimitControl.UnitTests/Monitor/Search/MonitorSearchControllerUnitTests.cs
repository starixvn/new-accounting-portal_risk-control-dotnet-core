using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.Monitor.Search;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Search
{
    public class MonitorSearchControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var monitorModels = new List<MonitorModel>();
            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Compat.Any<Request>()).Returns(monitorModels);

            // Act
            var controller = new MonitorSearchController(mediator);
            var actionResult = await controller.Post(new Request()) as OkObjectResult;

            // Assert
            DeepAssert.Equal(actionResult.Value, monitorModels);
        }
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.Search;
using Microsoft.AspNetCore.Mvc;

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
            mediator.Send(Arg.Any<Request>()).Returns(monitorModels);

            // Act
            var controller = new MonitorSearchController(mediator);
            var actionResult = await controller.Post(new Request());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, monitorModels);
        }
    }
}
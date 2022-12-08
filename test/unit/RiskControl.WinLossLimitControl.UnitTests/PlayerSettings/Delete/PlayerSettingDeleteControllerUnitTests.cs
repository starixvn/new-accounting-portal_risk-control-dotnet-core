using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Delete;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Delete
{
    public class PlayerSettingDeleteControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var executeResult = new ExecuteResult();

            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Compat.Any<Request>()).Returns(executeResult);

            var controller = new PlayerSettingDeleteController(mediator);

            // Act
            var actionResult = await controller.Post(new Request()) as OkObjectResult;

            // Assert
            DeepAssert.Equal(actionResult.Value, executeResult);
        }
    }
}

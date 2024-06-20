using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using WinLossLimitControl.Monitor.Account;

public class MonitorAccountControllerUnitTests
{
    [Fact]
    public async Task Post_ReturnsOkResult_WhenCalledWithValidRequest()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var controller = new MonitorAccountController(mediator);
        var request = new Request(); // Replace with your actual Request object
        var expectedViewModel = new AccountModel(); // Replace with your actual ViewModel object
        mediator.Send(request).Returns(expectedViewModel);

        // Act
        var result = await controller.Post(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedViewModel, okResult.Value);
    }
}

using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.WinLossLimitControl.Groups;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Groups;

using Xunit.Asserts.Compare;

public class GroupSettingControllerUnitTests
{
    [Fact]
    public async Task Post_Always_ReturnsResultFromMediator()
    {
        // Arrange
        var settings = new List<ProductGroupSetting>();
        var mediator = Substitute.For<IMediator>();
        mediator.Send(Arg.Compat.Any<Request>()).Returns(settings);

        // Act
        var controller = new GroupSettingController(mediator);
        var actionResult = await controller.Post(new Request()) as OkObjectResult;
        var jsonResult = actionResult.Value as List<ProductGroupSetting>;

        // Assert
        DeepAssert.Equal(jsonResult, settings);
    }
}
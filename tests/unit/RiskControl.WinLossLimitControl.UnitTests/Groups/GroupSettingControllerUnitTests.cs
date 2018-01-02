using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Groups;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.Groups
{
    public class GroupSettingControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var settings = new List<ProductGroupSetting>();
            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<Request>()).Returns(settings);

            // Act
            var controller = new GroupSettingController(mediator);
            var actionResult = await controller.Post();
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, settings);
        }
    }
}
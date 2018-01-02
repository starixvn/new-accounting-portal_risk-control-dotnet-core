using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;
using RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.SearchForInserting
{
    public class PlayerSettingSearchForInsertingControllerUnitTests
    {
        [Fact]
        public async Task Post_RequestSearch_ReturnsResultFromMediator()
        {
            // Arrange
            var playerSettings = new List<PlayerSettingCurrency>();

            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<RequestSearch>()).Returns(playerSettings);

            var controller = new PlayerSettingSearchForInsertingController(mediator);

            // Act
            var actionResult = await controller.Post(new RequestSearch());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, playerSettings);
        }

        [Fact]
        public async Task Post_RequestValidation_ReturnsResultFromMediator()
        {
            // Arrange
            var executeResult = new ExecuteResult();

            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<RequestValidation>()).Returns(executeResult);

            var controller = new PlayerSettingSearchForInsertingController(mediator);

            // Act
            var actionResult = await controller.Post(new RequestValidation());
            var jsonResult = actionResult as JsonResult;

            // Assert
            Assert.Equal(jsonResult.Value, executeResult);
        }
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.PlayerSettings.Search;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Search
{
    public class PlayerSettingSearchControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var playerSettings = new List<PlayerSettingCurrency>();

            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<Request>()).Returns(playerSettings);

            var controller = new PlayerSettingSearchController(mediator);

            // Act
            var actionResult = await controller.Post(new Request());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, playerSettings);
        }
    }
}
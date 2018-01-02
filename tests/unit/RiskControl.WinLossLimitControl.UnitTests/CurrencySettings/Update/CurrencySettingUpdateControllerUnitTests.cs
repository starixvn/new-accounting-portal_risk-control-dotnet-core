using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.Models;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update
{
    public class CurrencySettingUpdateControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var executeResult = new ExecuteResult();

            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<Request>()).Returns(executeResult);

            var controller = new CurrencySettingUpdateController(mediator);

            // Act
            var actionResult = await controller.Post(new Request());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, executeResult);
        }
    }
}
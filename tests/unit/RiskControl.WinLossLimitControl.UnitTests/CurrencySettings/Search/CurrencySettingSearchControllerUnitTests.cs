using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Search
{
    public class CurrencySettingSearchControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var settings = new List<SettingSite>();
            var request = new Request();
            var mediator = Substitute.For<IMediator>();
            mediator.Send(request).Returns(settings);

            // Act
            var controller = new CurrencySettingSearchController(mediator);
            var actionResult = await controller.Post(request);
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, settings);
        }
    }
}
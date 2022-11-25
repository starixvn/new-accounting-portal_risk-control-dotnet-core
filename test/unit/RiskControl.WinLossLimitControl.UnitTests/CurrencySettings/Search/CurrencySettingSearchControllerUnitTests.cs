using MediatR;
using NSubstitute;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Search
{
    public class CurrencySettingSearchControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_CallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();

            // Act
            var controller = new CurrencySettingSearchController(mediator);
            await controller.Post(new Request());

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<Request>());
        }
    }
}

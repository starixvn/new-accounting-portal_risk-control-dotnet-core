using NSubstitute;
using RiskControl.BettingMonitoring.Models;
using RiskControl.BettingMonitoring.Query;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.BettingMonitoring.UnitTests.Query
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_ReturnsDataFromService()
        {
            // Arrange
            var queryService = Substitute.For<QueryService>();
            var model = new BettingMonitoringModel { MinimumTickets = 25, Threshold = 25 };
            queryService.Execute().Returns(model);

            // Act
            var handler = new Handler(queryService);
            var actualResults = await handler.Handle(new Message(), new CancellationToken());

            // Assert
            Assert.Equal(model, actualResults);
        }
    }
}

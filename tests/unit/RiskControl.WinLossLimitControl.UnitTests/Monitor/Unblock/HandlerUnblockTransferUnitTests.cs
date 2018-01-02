using System.Threading.Tasks;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using Olympus.DotNetCore.Authentication;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock
{
    public class HandlerUnblockTransferUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_Always_ReturnsSuccessful()
        {
            // Arrange
            var stateService = Substitute.For<StateService>();
            var service = Substitute.For<UnblockMemberService>();

            // Act
            var handler = new HandlerUnblockTransfer(stateService, service);
            var result = await handler.Handle(new RequestUnblockTransfer(), CancellationToken.None);

            // Assert
            var expected = new ExecuteResult();
            DeepAssert.Equal(result, expected);
        }
    }
}
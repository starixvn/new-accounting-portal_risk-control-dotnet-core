using AutoMapper;
using NSubstitute;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock;

using Xunit.Asserts.Compare;

public class HandlerUnblockPlaceBetUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnsSuccessful()
    {
        // Arrange
        var userHttpContext = Substitute.For<UserHttpContext>();
        var service = Substitute.For<UnblockMemberService>();
        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<RequestUnblockPlaceBet, ServiceParameter>();
        }).CreateMapper();

        // Act
        var handler = new HandlerUnblockPlaceBet(userHttpContext, service, mapper);
        var result = await handler.Handle(new RequestUnblockPlaceBet(), new CancellationToken());

        // Assert
        var expected = new ExecuteResult();
        DeepAssert.Equal(result, expected);
    }
}
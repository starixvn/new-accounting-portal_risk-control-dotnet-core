using AutoMapper;
using NSubstitute;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock;

public class HandlerUnblockTransferUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnsSuccessful()
    {
        // Arrange
        var userHttpContext = Substitute.For<UserHttpContext>();
        var service = Substitute.For<UnblockMemberService>();
        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<RequestUnblockTransfer, ServiceParameter>();
        }).CreateMapper();

        // Act
        var handler = new HandlerUnblockTransfer(userHttpContext, service, mapper);
        var result = await handler.Handle(new RequestUnblockTransfer(), new CancellationToken());

        // Assert
        var expected = new ExecuteResult();
        DeepAssert.Equal(result, expected);
    }
}
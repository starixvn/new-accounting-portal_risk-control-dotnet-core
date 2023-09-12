using AutoMapper;
using Fanex.NAP.Client.Helpers.Web;
using NSubstitute;
using RiskControl.BettingMonitoring.Models;
using RiskControl.BettingMonitoring.Update;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.BettingMonitoring.UnitTests.Update;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnsDataFromService()
    {
        // Arrange
        const int UserId = 8;
        var napSession = Substitute.For<INapSession>();
        napSession.UserId.Returns(UserId);

        var updateService = Substitute.For<UpdateService>();
        updateService.Execute(Arg.Compat.Any<BettingMonitoringModel>()).Returns(true);

        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Message, BettingMonitoringModel>();
        });
        var mapper = mockMapper.CreateMapper();

        var handler = new Handler(napSession, updateService, mapper);

        // Act
        var message = new Message
        {
            MinimumTickets = 25,
            Threshold = 25
        };
        var result = await handler.Handle(message, new CancellationToken());

        // Assert
        Assert.True(result);
    }
}
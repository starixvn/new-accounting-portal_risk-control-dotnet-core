using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Web;
using NSubstitute;
using RiskControl.WinLossLimitControl.Monitor.History;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.History;

public class HandlerUncheckedNotificationUnitTests
{
    [Fact]
    public async Task Handle_Always_CallRepositoryExecuteAsync()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        repository.ExecuteAsync(Arg.Compat.Any<UncheckedNotificationCriteria>(), Arg.Compat.Any<CancellationToken>()).Returns(1);

        var sessionService = Substitute.For<INapSession>();
        sessionService.UserId.Returns(8);

        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<RequestUncheckedNotification, UncheckedNotificationCriteria>();
        }).CreateMapper();

        var handle = new HandlerUncheckedNotification(repository, sessionService, mapper);

        // Act
        await handle.Handle(new RequestUncheckedNotification(), new CancellationToken());

        // Assert
        await repository.Received().ExecuteAsync(Arg.Compat.Any<UncheckedNotificationCriteria>(), Arg.Compat.Any<CancellationToken>());
    }
}
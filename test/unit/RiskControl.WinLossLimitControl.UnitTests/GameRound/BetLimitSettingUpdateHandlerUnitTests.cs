using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Request;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound
{
    public class BetLimitSettingUpdateHandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_CallExecuteAsyncFromRepository()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            repository.ExecuteAsync(Arg.Compat.Any<BetLimitSettingUpdateCommand>()).Returns(0);

            var userHttpContext = Substitute.For<UserHttpContext>();
            userHttpContext.UserId.Returns(8);
            userHttpContext.IP.Returns("192.168.1.1");

            var mapper = new MapperConfiguration(mcf =>
            {
                mcf.CreateMap<BetLimitSettingUpdateRequest, BetLimitSettingUpdateCommand>();
            }).CreateMapper();

            var handle = new BetLimitSettingUpdateHandler(repository, userHttpContext, mapper);

            // Act
            await handle.Handle(new BetLimitSettingUpdateRequest(), new CancellationToken());

            // Assert
            await repository.Received().ExecuteAsync(Arg.Compat.Any<BetLimitSettingUpdateCommand>());
        }
    }
}

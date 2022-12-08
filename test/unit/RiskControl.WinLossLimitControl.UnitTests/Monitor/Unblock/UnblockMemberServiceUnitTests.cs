using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using RiskControl.WinLossLimitControl.Monitor.Unblock.Criteria;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock
{
    public class UnblockMemberServiceUnitTests
    {
        [Fact]
        public async Task UnblockPlaceBet_Always_CallRepositoryExecuteAsync()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            repository.ExecuteAsync(Arg.Compat.Any<WinLimitCustGameStatusPlaceBetUnblockCriteria>()).Returns(1);
            repository.ExecuteAsync(Arg.Compat.Any<WinLimitCustGameMonitoringHistoryInsertCriteria>()).Returns(1);
            var mapper = new MapperConfiguration(mcf =>
            {
                mcf.CreateMap<ServiceParameter, WinLimitCustGameStatusPlaceBetUnblockCriteria>();
                mcf.CreateMap<ServiceParameter, WinLimitCustGameMonitoringHistoryInsertCriteria>();
            }).CreateMapper();

            // Act
            var service = new UnblockMemberServiceImp(repository, mapper);
            await service.UnblockPlaceBet(new ServiceParameter());

            // Assert
            await repository.Received().ExecuteAsync(Arg.Compat.Any<WinLimitCustGameStatusPlaceBetUnblockCriteria>());
            await repository.Received().ExecuteAsync(Arg.Compat.Any<WinLimitCustGameMonitoringHistoryInsertCriteria>());
        }

        [Fact]
        public async Task UnblockTransfer_Always_CallRepositoryExecuteAsync()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            repository.ExecuteAsync(Arg.Compat.Any<WinLimitCustGameStatusTransferUnblockCriteria>()).Returns(1);
            repository.ExecuteAsync(Arg.Compat.Any<WinLimitCustGameMonitoringHistoryInsertCriteria>()).Returns(1);
            var mapper = new MapperConfiguration(mcf =>
            {
                mcf.CreateMap<ServiceParameter, WinLimitCustGameStatusTransferUnblockCriteria>();
                mcf.CreateMap<ServiceParameter, WinLimitCustGameMonitoringHistoryInsertCriteria>();
            }).CreateMapper();

            // Act
            var service = new UnblockMemberServiceImp(repository, mapper);
            await service.UnblockTransfer(new ServiceParameter());

            // Assert
            await repository.Received().ExecuteAsync(Arg.Compat.Any<WinLimitCustGameStatusTransferUnblockCriteria>());
            await repository.Received().ExecuteAsync(Arg.Compat.Any<WinLimitCustGameMonitoringHistoryInsertCriteria>());
        }
    }
}

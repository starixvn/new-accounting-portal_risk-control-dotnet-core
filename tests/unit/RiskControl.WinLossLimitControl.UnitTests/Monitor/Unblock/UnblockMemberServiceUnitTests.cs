using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.Unblock;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Unblock
{
    public class UnblockMemberServiceUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task UnblockPlaceBet_Always_ExecuteSuccessful()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();

            // Act
            var service = new UnblockMemberServiceImp(repository);
            await service.UnblockPlaceBet(new ServiceParameter());
        }

        [Fact]
        public async Task UnblockTransfer_Always_ExecuteSuccessful()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();

            // Act
            var service = new UnblockMemberServiceImp(repository);
            await service.UnblockTransfer(new ServiceParameter());
        }
    }
}
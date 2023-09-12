using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.BettingMonitoring.Criteria;
using RiskControl.BettingMonitoring.Models;
using RiskControl.BettingMonitoring.Update;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.BettingMonitoring.UnitTests.Update;

public class UpdateServiceUnitTests
{
    [Fact]
    public async Task Execute_Always_CallRepositoryExecuteAsync()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var mapper = Substitute.For<IMapper>();
        var service = new UpdateServiceImp(repository, mapper);

        // Act
        var model = new BettingMonitoringModel();
        await service.Execute(model);

        // Assert
        await repository.Received().ExecuteAsync(Arg.Compat.Any<BettingMonitoringUpdateCriteria>());
    }
}
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Delete;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Delete;

using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ExecuteSuccessfully()
    {
        // Arrange
        var userHttpContext = Substitute.For<UserHttpContext>();
        var repository = Substitute.For<IDynamicRepository>();
        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<Request, DeleteCriteria>();
        }).CreateMapper();

        // Act
        var handler = new Handler(userHttpContext, repository, mapper);
        var result = await handler.Handle(new Request(), new CancellationToken());

        // Assert
        DeepAssert.Equal(result, new ExecuteResult());
    }
}
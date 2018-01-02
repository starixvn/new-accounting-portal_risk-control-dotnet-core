using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Delete;
using RiskControl.WinLossLimitControl.Services;
using System.Threading;
using Olympus.DotNetCore.Authentication;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Delete
{
    public class HandlerUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_Always_ExecuteSuccessfully()
        {
            // Arrange
            var stateService = Substitute.For<StateService>();
            var repository = Substitute.For<IDynamicRepository>();

            // Act
            var handler = new Handler(stateService, repository);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            DeepAssert.Equal(result, new ExecuteResult());
        }
    }
}
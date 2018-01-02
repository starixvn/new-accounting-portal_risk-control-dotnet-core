using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;
using System.Threading;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.SearchForInserting
{
    public class HandlerValidationUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_Always_ReturnsDataFromRepository()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();

            repository.GetAsync<ExecuteResult>(Arg.Any<ICriteria>()).Returns(new ExecuteResult());

            // Act
            var handler = new HandlerValidation(repository);
            var result = await handler.Handle(new RequestValidation(), CancellationToken.None);

            // Assert
            DeepAssert.Equal(result, new ExecuteResult());
        }
    }
}
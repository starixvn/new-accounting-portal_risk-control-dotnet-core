using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;
using RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;
using RiskControl.WinLossLimitControl.Services;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using RiskControl.WinLossLimitControl.UnitTests.Utilities;
using System.Threading;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.SearchForInserting
{
    public class HandlerSearchUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Execute_Always_ReturnsListOfPlayerSettingCurrency()
        {
            // Arrange
            var fakeRawData = TestDataLoader.Load<List<PlayerSettingRaw>>("HappyPath-rawData");
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<PlayerSettingRaw>(Arg.Any<ICriteria>()).Returns(fakeRawData);

            var cacheRefSerivce = new CacheRefServiceMockImp();
            var dataTransformService = new DataTransformServiceImp();

            // Act
            var handler = new HandlerSearch(repository, cacheRefSerivce, dataTransformService);
            var result = await handler.Handle(new RequestSearch(), CancellationToken.None);

            // Assert
            var expected = TestDataLoader.Load<List<PlayerSettingCurrency>>("HappyPath-expected");
            DeepAssert.Equal(result, expected);
        }
    }
}
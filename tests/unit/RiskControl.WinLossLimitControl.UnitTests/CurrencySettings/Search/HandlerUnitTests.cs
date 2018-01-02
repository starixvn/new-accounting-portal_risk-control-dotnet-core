using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;
using RiskControl.WinLossLimitControl.Services;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using RiskControl.WinLossLimitControl.UnitTests.Utilities;
using System.Threading;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Search
{
    public class HandlerUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_Always_ReturnsValidResult()
        {
            // Arrange
            var fakeRawData = TestDataLoader.Load<List<CurrencySettingRaw>>("HappyPath-rawData");
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CurrencySettingRaw>(Arg.Any<ICriteria>()).Returns(fakeRawData);

            var cacheRefSerivce = new CacheRefServiceMockImp();
            var dataTransformService = new DataTransformServiceImp();

            // Act
            var request = new Request
            {
                CurrencyId = 20,
                IsCreditSite = true,
                ProductId = 3,
                SiteId = 20
            };
            var service = new Handler(repository, cacheRefSerivce, dataTransformService);
            var result = await service.Handle(request, CancellationToken.None);

            // Assert
            var expected = TestDataLoader.Load<List<SettingSite>>("HappyPath-expected");
            DeepAssert.Equal(result, expected);
        }
    }
}
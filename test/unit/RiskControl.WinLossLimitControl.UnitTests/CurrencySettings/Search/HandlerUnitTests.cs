using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;
using RiskControl.WinLossLimitControl.Services;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Search
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_ReturnsValidResult()
        {
            // Arrange
            var fakeRawData = TestDataProvider.Load<List<CurrencySettingRaw>>("HappyPath-rawData");
            var expected = TestDataProvider.Load<List<SettingSite>>("HappyPath-expected");
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CurrencySettingRaw>(Arg.Compat.Any<ICriteria>()).Returns(fakeRawData);

            var cacheRefSerivce = new CacheRefServiceMockImp();
            var dataTransformService = new DataTransformServiceImp();

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<Request, SearchCriteria>();
            }).CreateMapper();

            var request = new Request
            {
                CurrencyId = 20,
                IsCreditSite = 1,
                ProductId = 3,
                MultiSite = "20"
            };
            var service = new Handler(repository, cacheRefSerivce, dataTransformService, mapper);

            // Act

            var actualResult = await service.Handle(request, new CancellationToken());

            // Assert
            DeepAssert.Equal(expected, actualResult);
        }
    }
}

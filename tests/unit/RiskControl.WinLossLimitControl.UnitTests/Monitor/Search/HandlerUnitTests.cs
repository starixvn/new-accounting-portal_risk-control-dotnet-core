using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.Parser;
using RiskControl.WinLossLimitControl.Monitor.Search;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using RiskControl.WinLossLimitControl.UnitTests.Utilities;
using System.Threading;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Search
{
    public class HandlerUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_Always_ReturnsDataFromRepository()
        {
            // Arrange
            var fakeRawData = TestDataLoader.Load<List<MonitorModelRaw>>("HappyPath-rawData");
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<MonitorModelRaw>(Arg.Any<ICriteria>()).Returns(fakeRawData);

            var cacheRefService = new CacheRefServiceMockImp();
            var winLimitSettingXmlParser = new WinLimitSettingXmlParserImp();

            // Act
            var handler = new Handler(repository, cacheRefService, winLimitSettingXmlParser);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            var expected = TestDataLoader.Load<List<MonitorModel>>("HappyPath-expected");
            DeepAssert.Equal(result, expected);
        }
    }
}
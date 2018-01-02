using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.History;
using RiskControl.WinLossLimitControl.Monitor.Parser;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using RiskControl.WinLossLimitControl.UnitTests.Utilities;
using System.Threading;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.History
{
    public class HandlerUnitTests : IClassFixture<AutoMapperFixture>
    {
        [Fact]
        public async Task Handle_Always_ReturnsDataFromRepository()
        {
            // Arrange
            var fakeRawData = TestDataLoader.Load<List<WinLimitHistoryRaw>>("HappyPath-rawData");
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<WinLimitHistoryRaw>(Arg.Any<ICriteria>()).Returns(fakeRawData);

            var cacheRefService = new CacheRefServiceMockImp();
            var winLimitSettingXmlParserImp = new WinLimitSettingXmlParserImp();

            // Act
            var handler = new Handler(repository, cacheRefService, winLimitSettingXmlParserImp);
            var result = await handler.Handle(new Request(), CancellationToken.None);

            // Assert
            var expected = TestDataLoader.Load<List<WinLimitHistory>>("HappyPath-expected");
            DeepAssert.Equal(result, expected);
        }
    }
}
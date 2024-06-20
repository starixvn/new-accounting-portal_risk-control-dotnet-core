using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.Monitor.History;
using RiskControl.WinLossLimitControl.Monitor.Parser;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.History;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnsDataFromRepository()
    {
        // Arrange
        var fakeRawData = TestDataProvider.Load<List<WinLimitHistoryRaw>>("win-limit-history-raw");
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<WinLimitHistoryRaw>(Arg.Compat.Any<ICriteria>()).Returns(fakeRawData);

        var cacheRefService = new CacheRefServiceMockImp();
        var winLimitSettingXmlParserImp = new WinLimitSettingXmlParserImp();

        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<Request, HistoryCriteria>();
        }).CreateMapper();

        // Act
        var handler = new Handler(repository, cacheRefService, winLimitSettingXmlParserImp, mapper);
        var result = await handler.Handle(new Request(), new CancellationToken());

        // Assert
        var expected = TestDataProvider.Load<List<WinLimitHistory>>("win-limit-history");
        DeepAssert.Equal(result, expected);
    }
}
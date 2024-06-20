using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.Monitor.Parser;
using RiskControl.WinLossLimitControl.Monitor.Search;
using RiskControl.WinLossLimitControl.UnitTests.Mocks;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Search;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_Always_ReturnsDataFromRepository()
    {
        // Arrange
        var fakeRawData = TestDataProvider.Load<List<MonitorModelRaw>>("monitor-model-raw");
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<MonitorModelRaw>(Arg.Compat.Any<ICriteria>()).Returns(fakeRawData);

        var cacheRefService = new CacheRefServiceMockImp();
        var winLimitSettingXmlParser = new WinLimitSettingXmlParserImp();

        var mapper = new MapperConfiguration(mcf =>
        {
            mcf.CreateMap<Request, MonitorSearchCriteria>();
        }).CreateMapper();

        // Act
        var handler = new Handler(repository, cacheRefService, winLimitSettingXmlParser, mapper);
        var result = await handler.Handle(new Request(), new CancellationToken());

        // Assert
        var expected = TestDataProvider.Load<List<MonitorModel>>("monitor-model");
        DeepAssert.Equal(result, expected);
    }
}
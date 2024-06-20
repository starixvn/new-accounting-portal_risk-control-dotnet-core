using AutoMapper;
using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.Normal;
using RiskControl.NonSportsGamesStatistics.Model;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.CurrencyView.GrandTotal.Normal;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_GrandTotalNormalModeWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeCurrencyViewReportModel = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-service-data");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeCurrencyViewReportModel);

        var gridOptionService = Substitute.For<GridOptionBuilderService>();
        gridOptionService.BuildGridOptions(Arg.Compat.Any<CurrencyViewStatisticsReportModel>(), Arg.Compat.Any<QueryModel>(), Arg.Compat.Any<int>()).Returns(fakeGridOptions);

        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<QueryModel, Criteria>();
        });
        var mapper = mockMapper.CreateMapper();

        var handler = new Handler(service, gridOptionService, mapper);

        // Act
        var actulaResult = await handler.Handle(new QueryModel { WinLostDate = new DateTime(2017, 1, 1) }, new CancellationToken());

        // Assert
        DeepAssert.Equal(actulaResult, expectedGridOptions);
    }
}
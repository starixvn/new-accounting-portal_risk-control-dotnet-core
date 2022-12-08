using AutoMapper;
using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.CurrencyView.Main;
using RiskControl.NonSportsGamesStatistics.CurrencyView.Main.Normal;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.CurrencyView.Main.Normal
{
    public class HandlerUnitTests
    {
        private readonly IMapper mapper;

        public HandlerUnitTests()
        {
            var mockMapper = new MapperConfiguration(mc =>
            {
                mc.CreateMap<QueryModel, Criteria>();
            });
            mapper = mockMapper.CreateMapper();
        }

        [Fact]
        public async Task Handle_NormalWithModeSortColummNameAndSortDirectionIsNotNullOrEmpty_AllwayCallSortDataFunction()
        {
            // Arrange
            var fakeCurrencyReportModel = new CurrencyViewStatisticsReportModel();

            var service = Substitute.For<Service>();
            service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeCurrencyReportModel);

            var sortingService = Substitute.For<SortingService>();

            var gridOptionService = Substitute.For<GridOptionBuilderService>();

            var handler = new Handler(service, sortingService, gridOptionService, mapper);

            // Act
            await handler.Handle(new QueryModel { WinLostDate = new DateTime(2017, 1, 1), SortColumnName = "Any Column", SortDirection = "Any Direction" }, new CancellationToken());

            // Assert
            sortingService.Received().SortData(fakeCurrencyReportModel, "Any Direction", "Any Column");
        }

        [Fact]
        public async Task Handle_NormalModeWithSortColummNameAndSortDirectionIsNullOrEmpty_DoesNotCallSortDataFunction()
        {
            // Arrange          
            var service = Substitute.For<Service>();

            var sortingService = Substitute.For<SortingService>();

            var gridOptionService = Substitute.For<GridOptionBuilderService>();

            var handler = new Handler(service, sortingService, gridOptionService, mapper);

            // Act
            await handler.Handle(new QueryModel { WinLostDate = new DateTime(2017, 1, 1), SortColumnName = string.Empty, SortDirection = string.Empty }, new CancellationToken());

            // Assert
            sortingService.DidNotReceive().SortData(Arg.Compat.Any<CurrencyViewStatisticsReportModel>(), string.Empty, string.Empty);
        }

        [Fact]
        public async Task Handle_NormalModeWithAnyQueryModel_ReturnRightGridOptions()
        {
            // Arrange
            var fakeCurrencyViewReportModel = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-service-data");
            var fakeSortCurrencyViewReportModel = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-sorting-service-data");
            var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
            var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

            var service = Substitute.For<Service>();
            service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeCurrencyViewReportModel);

            var sortingService = Substitute.For<SortingService>();
            sortingService.SortData(Arg.Compat.Any<CurrencyViewStatisticsReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(fakeSortCurrencyViewReportModel);

            var gridOptionService = Substitute.For<GridOptionBuilderService>();
            gridOptionService.BuildGridOptions(Arg.Compat.Any<CurrencyViewStatisticsReportModel>(), Arg.Compat.Any<QueryModel>(), Arg.Compat.Any<int>()).Returns(fakeGridOptions);

            var handler = new Handler(service, sortingService, gridOptionService, mapper);

            // Act
            var actualResult = await handler.Handle(new QueryModel { WinLostDate = new DateTime(2017, 1, 1), SortColumnName = "TotalBets", SortDirection = "Desc" }, new CancellationToken());

            // Assert
            DeepAssert.Equal(actualResult, expectedGridOptions);
        }
    }
}

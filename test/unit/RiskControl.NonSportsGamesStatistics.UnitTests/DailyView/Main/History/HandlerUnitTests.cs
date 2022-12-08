using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Main.History;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Main.History
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_MainHistoryModeWithSortColummNameAndSortDirectionIsNotNullOrEmpty_AllwayCallSortDataFunction()
        {
            // Arrange
            var fakeDailyViewReportModel = new DailyViewReportModel();

            var service = Substitute.For<Service<DailyViewReportModel, Criteria>>();
            service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeDailyViewReportModel);

            var sortingService = Substitute.For<SortingService<DailyViewReportModel>>();

            var gridOptionService = Substitute.For<GridOptionBuilderService<DailyViewReportModel, QueryModel>>();

            var handler = new Handler(service, sortingService, gridOptionService);

            // Act
            await handler.Handle(
                new QueryModel
                {
                    FromDate = new DateTime(2017, 1, 1),
                    ToDate = new DateTime(2017, 3, 1),
                    SortColumnName = "Any Column",
                    SortDirection = "Any Direction",
                    IsDrillDown = false,
                    IsGrandTotal = false
                },
                new CancellationToken());

            // Assert
            sortingService.Received().SortData(fakeDailyViewReportModel, "Any Direction", "Any Column");
        }

        [Fact]
        public async Task Handle_MainHistoryModeWithSortColummNameAndSortDirectionIsNullOrEmpty_DoesNotCallSortDataFunction()
        {
            // Arrange
            var service = Substitute.For<Service<DailyViewReportModel, Criteria>>();

            var sortingService = Substitute.For<SortingService<DailyViewReportModel>>();

            var gridOptionService = Substitute.For<GridOptionBuilderService<DailyViewReportModel, QueryModel>>();

            var handler = new Handler(service, sortingService, gridOptionService);

            // Act
            await handler.Handle(
                new QueryModel
                {
                    FromDate = new DateTime(2017, 1, 1),
                    ToDate = new DateTime(2017, 3, 1),
                    SortColumnName = string.Empty,
                    SortDirection = string.Empty,
                    IsDrillDown = false,
                    IsGrandTotal = false
                },
                new CancellationToken());

            // Assert
            sortingService.DidNotReceive().SortData(Arg.Compat.Any<DailyViewReportModel>(), string.Empty, string.Empty);
        }

        [Fact]
        public async Task Handle_MainHistoryModeWithAnyQueryModel_ReturnRightGridOptions()
        {
            // Arrange
            var fakeDailyViewReportModel = TestDataProvider.Load<DailyViewReportModel>("fake-service-data");
            var fakeSortDailyViewReportModel = TestDataProvider.Load<DailyViewReportModel>("fake-sorting-service-data");
            var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
            var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

            var service = Substitute.For<Service<DailyViewReportModel, Criteria>>();
            service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeDailyViewReportModel);

            var sortingService = Substitute.For<SortingService<DailyViewReportModel>>();
            sortingService.SortData(Arg.Compat.Any<DailyViewReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(fakeSortDailyViewReportModel);

            var gridOptionService = Substitute.For<GridOptionBuilderService<DailyViewReportModel, QueryModel>>();
            gridOptionService.BuildGridOptions(Arg.Compat.Any<DailyViewReportModel>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

            var handler = new Handler(service, sortingService, gridOptionService);

            // Act
            var actualResult = await handler.Handle(
                new QueryModel
                {
                    FromDate = new DateTime(2017, 1, 1),
                    ToDate = new DateTime(2017, 3, 1),
                    SortColumnName = "TotalBets",
                    SortDirection = "Desc"
                },
                new CancellationToken());

            // Assert
            DeepAssert.Equal(actualResult, expectedGridOptions);
        }
    }
}

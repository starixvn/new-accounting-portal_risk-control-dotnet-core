using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Product;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Product;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_ProductWithSortColummNameAndSortDirectionIsNotNullOrEmpty_AllwayCallSortDataFunction()
    {
        // Arrange
        var fakeProductReportModel = new DailyViewReportModel();

        var service = Substitute.For<Service<DailyViewReportModel, HistoryCriteria>>();
        service.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeProductReportModel);

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
        sortingService.Received().SortData(fakeProductReportModel, "Any Direction", "Any Column");
    }

    [Fact]
    public async Task Handle_ProductWithSortColummNameAndSortDirectionIsNullOrEmpty_DoesNotCallSortDataFunction()
    {
        // Arrange           
        var service = Substitute.For<Service<DailyViewReportModel, HistoryCriteria>>();

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
    public async Task Handle_ProductWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeProductReportModel = TestDataProvider.Load<DailyViewReportModel>("fake-service-data");
        var fakeSortProductReportModel = TestDataProvider.Load<DailyViewReportModel>("fake-sorting-service-data");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service<DailyViewReportModel, HistoryCriteria>>();
        service.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeProductReportModel);

        var sortingService = Substitute.For<SortingService<DailyViewReportModel>>();
        sortingService.SortData(Arg.Compat.Any<DailyViewReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(fakeSortProductReportModel);

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
                SortDirection = "Asc",
                RemovalColumns = new List<string> { "TotalWins", "TotalRefund", "NoOfPlayers" }
            },
            new CancellationToken());

        TestDataProvider.Write("fake-gridOptions", actualResult);

        // Assert
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.CompanyHistory;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GroupStatistics.CompanyHistory;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_CompanyHistoryModeWithSortColummNameAndSortDirectionIsNotNullOrEmpty_AllwayCallSortDataFunction()
    {
        // Arrange
        var fakeCompanyReportModel = new DailyViewGroupStatisticWithTotalReportModel();

        var service = Substitute.For<Service<DailyViewGroupStatisticWithTotalReportModel, Criteria>>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeCompanyReportModel);

        var sortingService = Substitute.For<SortingService<DailyViewGroupStatisticWithTotalReportModel>>();

        var gridOptionService = Substitute.For<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, QueryModel>>();

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
        sortingService.Received().SortData(fakeCompanyReportModel, "Any Direction", "Any Column");
    }

    [Fact]
    public async Task Handle_CompanyHistoryModeWithSortColummNameAndSortDirectionIsNullOrEmpty_DoesNotCallSortDataFunction()
    {
        // Arrange            
        var service = Substitute.For<Service<DailyViewGroupStatisticWithTotalReportModel, Criteria>>();

        var sortingService = Substitute.For<SortingService<DailyViewGroupStatisticWithTotalReportModel>>();

        var gridOptionService = Substitute.For<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, QueryModel>>();

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
        sortingService.DidNotReceive().SortData(Arg.Compat.Any<DailyViewGroupStatisticWithTotalReportModel>(), string.Empty, string.Empty);
    }

    [Fact]
    public async Task Handle_CompanyHistoryModeWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeCompanyReportModel = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("fake-service-data");
        var fakeSortCompanyReportModel = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("fake-sorting-service-data");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service<DailyViewGroupStatisticWithTotalReportModel, Criteria>>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeCompanyReportModel);

        var sortingService = Substitute.For<SortingService<DailyViewGroupStatisticWithTotalReportModel>>();
        sortingService.SortData(Arg.Compat.Any<DailyViewGroupStatisticWithTotalReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(fakeSortCompanyReportModel);

        var gridOptionService = Substitute.For<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, QueryModel>>();
        gridOptionService.BuildGridOptions(Arg.Compat.Any<DailyViewGroupStatisticWithTotalReportModel>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

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
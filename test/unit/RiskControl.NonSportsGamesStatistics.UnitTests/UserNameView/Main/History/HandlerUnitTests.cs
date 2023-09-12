using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.UserNameView.Main.History;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.Main.History;

using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_MainHistoryModeWithSortColummNameAndSortDirectionIsNotNullOrEmpty_AllwayCallSortDataFunction()
    {
        // Arrange
        var fakeDailyViewReportModel = new UserNameViewReportModel();

        var service = Substitute.For<Service<UserNameViewReportModel, Criteria>>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeDailyViewReportModel);

        var sortingService = Substitute.For<SortingService<UserNameViewReportModel>>();

        var gridOptionService = Substitute.For<GridOptionBuilderService<UserNameViewReportModel, QueryModel>>();

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
                IsGrandTotal = false,
                RoleId = 1
            },
            new CancellationToken());

        // Assert
        sortingService.Received().SortData(fakeDailyViewReportModel, "Any Direction", "Any Column");
    }

    [Fact]
    public async Task Handle_MainHistoryModeWithSortColummNameAndSortDirectionIsNullOrEmpty_DoesNotCallSortDataFunction()
    {
        // Arrange
        var service = Substitute.For<Service<UserNameViewReportModel, Criteria>>();

        var sortingService = Substitute.For<SortingService<UserNameViewReportModel>>();

        var gridOptionService = Substitute.For<GridOptionBuilderService<UserNameViewReportModel, QueryModel>>();

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
                IsGrandTotal = false,
                RoleId = 1
            },
            new CancellationToken());

        // Assert
        sortingService.DidNotReceive().SortData(Arg.Compat.Any<UserNameViewReportModel>(), string.Empty, string.Empty);
    }

    [Fact]
    public async Task Handle_MainHistoryModeWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeUsernameViewReportModel = TestDataProvider.Load<UserNameViewReportModel>("fake-service-data");
        var fakeSortUsernameViewReportModel = TestDataProvider.Load<UserNameViewReportModel>("fake-sorting-service-data");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service<UserNameViewReportModel, Criteria>>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeUsernameViewReportModel);

        var sortingService = Substitute.For<SortingService<UserNameViewReportModel>>();
        sortingService.SortData(Arg.Compat.Any<UserNameViewReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(fakeSortUsernameViewReportModel);

        var gridOptionService = Substitute.For<GridOptionBuilderService<UserNameViewReportModel, QueryModel>>();
        gridOptionService.BuildGridOptions(Arg.Compat.Any<UserNameViewReportModel>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

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
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
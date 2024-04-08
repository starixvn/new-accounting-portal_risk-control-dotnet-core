using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.TopTwenty.Main;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.Main;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_MainTopTwentyWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeMainTopTwentyReportModel = TestDataProvider.Load<List<UserNameViewGroupStatisticsWithTotalModel>>("fake-service-data");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service<List<UserNameViewGroupStatisticsWithTotalModel>, Criteria>>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeMainTopTwentyReportModel);

        var gridOptionService = Substitute.For<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, QueryModel>>();
        gridOptionService.BuildGridOptions(Arg.Compat.Any<List<UserNameViewGroupStatisticsWithTotalModel>>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

        var handler = new Handler(service, gridOptionService);

        // Act
        var actualResult = await handler.Handle(
            new QueryModel
            {
                FromDate = new DateTime(2017, 1, 1),
                ToDate = new DateTime(2017, 3, 1),
                IsDrillDown = false,
                TopType = 0,
                RoleId = 1,
                IsNormalMode = false,
                SortColumnName = "GameIncome"
            },
            new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
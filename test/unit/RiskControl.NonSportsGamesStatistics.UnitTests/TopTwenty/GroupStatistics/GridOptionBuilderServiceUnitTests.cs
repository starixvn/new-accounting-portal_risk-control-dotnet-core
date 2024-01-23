using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.TopTwenty.Common;
using RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;
using RiskControl.UnitTest.Core.TestUtilities;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.GroupStatistics;

using Xunit.Asserts.Compare;

public class GridOptionBuilderServiceUnitTests
{
    [Fact]
    public void BuildGridOptions_MainTopTwentyWithAnyStatistics_ReturnRightGridOptions()
    {
        // Arrange
        var fakeGridOptionsAfterRemoveColumns = TestDataProvider.Load<GridOptions>("fake-gridoptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridoptions");

        var gridDataRowBuilderService = Substitute.For<GridOptionDataRowBuilderService>();
        var headerBuilderService = Substitute.For<GridOptionHeaderBuilderService>();

        var gridOptionRemoveColumnService = Substitute.For<GridOptionRemoveColumnService>();
        gridOptionRemoveColumnService.RemoveColumn(Arg.Compat.Any<GridOptions>(), Arg.Compat.Any<List<string>>()).Returns(fakeGridOptionsAfterRemoveColumns);

        var service = new GridOptionBuilderServiceImp<BaseStatisticQueryModel>(gridDataRowBuilderService, headerBuilderService, gridOptionRemoveColumnService);

        // Act
        var actualResult = service.BuildGridOptions(
            new UserNameViewGroupStatisticsWithTotalModel(),
            new BaseStatisticQueryModel
            {
                ProductId = "0",
                Site = "site",
                Bettype = "1",
                LeagueId = "1",
                Sporttype = "1",
                GameTableId = "1",
                Currency = "0",
                Device = "h, i",
                ExcludeTest = true,
                TotalBetType = 0,
                TotalBetValue = 0,
                HousePTType = 0,
                HousePTValue = 0,
                RemovalColumns = ["a", "b"],
                SortDirection = "asc",
                SortColumnName = "any name",
                ReportBy = "top 20",
                IsNormalMode = true,
                Title = "any title",
                ViewByInteger = false
            });

        // Assert
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
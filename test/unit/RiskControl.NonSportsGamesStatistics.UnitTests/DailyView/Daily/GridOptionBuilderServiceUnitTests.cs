using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Daily;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.Daily;

using Xunit.Asserts.Compare;

public class GridOptionBuilderServiceUnitTests
{
    [Fact]
    public void BuildGridOptions_DailyWithAnyStatistics_ReturnRightGridOptions()
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
        var actualResult = service.BuildGridOptions(new DailyReportModel(), new BaseStatisticQueryModel());

        // Assert
        DeepAssert.Equal(actualResult, expectedGridOptions);
    }
}
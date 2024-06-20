using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;
using RiskControl.NonSportsGamesStatistics.Model;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GrandTotal;

using RiskControl.UnitTests.TestUtilities;
using Xunit.Asserts.Compare;

public class GridOptionBuilderServiceUnitTests
{
    [Fact]
    public void BuildGridOptions_CurrencyGrandTotalWithAnyStatistics_ReturnRightGridOptions()
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
        var actualResult = service.BuildGridOptions(new CurrencyViewStatisticsReportModel(), new BaseStatisticQueryModel());

        // Assert
        DeepAssert.Equal(actualResult, expectedGridOptions);
    }
}
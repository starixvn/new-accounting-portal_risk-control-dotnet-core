using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.UserNameView.Common;
using RiskControl.NonSportsGamesStatistics.UserNameView.Main;
using RiskControl.UnitTest.Core.TestUtilities;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.Main;

using Xunit.Asserts.Compare;

public class GridOptionBuilderServiceUnitTests
{
    [Fact]
    public void BuildGridOptions_UserNameViewMainWithAnyStatistics_ReturnRightGridOptions()
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
        var actualResult = service.BuildGridOptions(new UserNameViewReportModel(), new BaseStatisticQueryModel());

        // Assert
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
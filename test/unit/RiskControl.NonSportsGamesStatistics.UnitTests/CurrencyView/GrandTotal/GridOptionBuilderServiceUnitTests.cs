using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.CurrencyView.Common;
using RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.CurrencyView.GrandTotal
{
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

            var service = new GridOptionBuilderServiceImp(gridDataRowBuilderService, headerBuilderService, gridOptionRemoveColumnService);

            // Act
            var actualResult = service.BuildGridOptions(new CurrencyViewStatisticsReportModel(), new BaseStatisticQueryModel(), Arg.Compat.Any<int>());

            // Assert
            DeepAssert.Equal(actualResult,expectedGridOptions);
        }
    }
}

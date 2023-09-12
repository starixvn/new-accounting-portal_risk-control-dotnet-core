using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.VoidRejectRefund.Common;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common;

using Xunit.Asserts.Compare;

public class GroupHandlerUnitTests
{
    [Fact]
    public async Task Handle_ParameterWithSortDirectionAndSortColumnNameIsEmpty_ReturnRightGroupStatisticModel()
    {
        // Arrange
        var expectedModel = TestDataProvider.Load<GroupStatisticReportModel>("group-statistic-report-model");
        var expectedSortModel = TestDataProvider.Load<GroupStatisticReportModel>("group-statistic-report-model");

        var service = Substitute.For<GroupService>();
        service.Query(Arg.Compat.Any<HttpParameterJsonBase>()).Returns(expectedModel);

        var sortingService = Substitute.For<SortingService<GroupStatisticReportModel>>();
        sortingService.SortData(Arg.Compat.Any<GroupStatisticReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(expectedSortModel);

        var handler = new GroupHandler(service, sortingService);

        // Act
        var actualResult = await handler.Handle(new HttpParameterGroupJson(), new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedModel, actualResult);
    }

    [Fact]
    public async Task Handle_ParameterWithSortDirectionAndSortColumnNameIsNotEmpty_ReturnRightGroupStatisticModel()
    {
        // Arrange
        var expectedModel = TestDataProvider.Load<GroupStatisticReportModel>("group-statistic-report-model");
        var expectedSortModel = TestDataProvider.Load<GroupStatisticReportModel>("sorted-asc-betcount-group-statistic-report-model");

        var service = Substitute.For<GroupService>();
        service.Query(Arg.Compat.Any<HttpParameterJsonBase>()).Returns(expectedModel);

        var sortingService = Substitute.For<SortingService<GroupStatisticReportModel>>();
        sortingService.SortData(Arg.Compat.Any<GroupStatisticReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(expectedSortModel);

        var handler = new GroupHandler(service, sortingService);

        // Act
        var actualResult = await handler.Handle(
            new HttpParameterGroupJson
            {
                SortDirection = "asc",
                SortColumnName = "BetCount"
            },
            new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedModel, actualResult);
    }
}
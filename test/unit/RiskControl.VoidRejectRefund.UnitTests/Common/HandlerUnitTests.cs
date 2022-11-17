using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.VoidRejectRefund.Common;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_ParameterWithSortDirectionAndSortColumnNameIsEmpty_ReturnRightStatisticModel()
        {
            // Arrange
            var expectedModel = TestDataProvider.Load<StatisticReportModel>("statistic-report-model-data");
            var expectedSortModel = TestDataProvider.Load<StatisticReportModel>("statistic-report-model-data");

            var service = Substitute.For<Service>();
            service.Query(Arg.Compat.Any<HttpParameterJsonBase>()).Returns(expectedModel);

            var sortingService = Substitute.For<SortingService<StatisticReportModel>>();
            sortingService.SortData(Arg.Compat.Any<StatisticReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(expectedSortModel);

            var handler = new Handler(service, sortingService);

            // Act
            var actualResult = await handler.Handle(new HttpParameterJson(), new CancellationToken());

            // Assert
            DeepAssert.Equal(expectedModel, actualResult);
        }

        [Fact]
        public async Task Handle_ParameterWithSortDirectionAndSortColumnNameIsNotEmpty_ReturnRightStatisticModel()
        {
            // Arrange
            var expectedModel = TestDataProvider.Load<StatisticReportModel>("statistic-report-model-data");
            var expectedSortModel = TestDataProvider.Load<StatisticReportModel>("sorted-statistic-report-model-data");

            var service = Substitute.For<Service>();
            service.Query(Arg.Compat.Any<HttpParameterJsonBase>()).Returns(expectedModel);

            var sortingService = Substitute.For<SortingService<StatisticReportModel>>();
            sortingService.SortData(Arg.Compat.Any<StatisticReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(expectedSortModel);

            var handler = new Handler(service, sortingService);

            // Act
            var actualResult = await handler.Handle(
                new HttpParameterJson
                {
                    SortDirection = "asc",
                    SortColumnName = "BetCount"
                },
                new CancellationToken());

            // Assert
            DeepAssert.Equal(expectedSortModel, actualResult);
        }
    }
}

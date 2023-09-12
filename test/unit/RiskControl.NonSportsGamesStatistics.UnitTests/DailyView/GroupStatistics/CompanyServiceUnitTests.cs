using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GroupStatistics;

using Xunit.Asserts.Compare;

public class CompanyServiceUnitTests
{
    [Fact]
    public async Task Query_CompanyWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<CompanyRawStatistics>>("full-fake-raw-data");
        var fakeCalculationCompanyReport = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("fake-calculation-company-statistic");
        var expectedResult = TestDataProvider.Load<DailyViewGroupStatisticWithTotalReportModel>("expected-statistic");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<CompanyRawStatistics>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateCompanyReport(Arg.Compat.Any<GenericRawData<CompanyRawStatistics>>()).Returns(fakeCalculationCompanyReport);

        var service = new CompanyServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(actualResult, expectedResult);
    }
}
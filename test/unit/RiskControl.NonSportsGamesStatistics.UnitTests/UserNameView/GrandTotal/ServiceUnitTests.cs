using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.GrandTotal;

using Xunit.Asserts.Compare;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_UserNameViewGrandTotalWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<UserNameViewRawStatistics>>("full-fake-raw-data");
        var fakeCalculationUserNameGrandTotalReport = TestDataProvider.Load<UserNameViewReportModel>("fake-calculation-username-grand-total-statistic");
        var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-statistic");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<UserNameViewRawStatistics>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateUserNameViewGrandTotal(Arg.Compat.Any<GenericRawData<UserNameViewRawStatistics>>()).Returns(fakeCalculationUserNameGrandTotalReport);

        var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
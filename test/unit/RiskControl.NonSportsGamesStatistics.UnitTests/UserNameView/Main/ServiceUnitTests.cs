using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.NonSportsGamesStatistics.UserNameView.Main;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.Main;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_UserNameViewWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var rawData = TestDataProvider.Load<GenericRawData<UserNameViewRawStatistics>>("full-fake-raw-data");
        var fakeCalculationUserNameReport = TestDataProvider.Load<UserNameViewReportModel>("fake-calculation-username-statistic");
        var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-statistic");

        var rawService = Substitute.For<RawService>();
        rawService.QueryMultipleData<UserNameViewRawStatistics>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

        var calculationService = Substitute.For<CalculationService>();
        calculationService.CalculateUserNameViewReport(Arg.Compat.Any<GenericRawData<UserNameViewRawStatistics>>()).Returns(fakeCalculationUserNameReport);

        var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

        // Act
        var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.NonSportsGamesStatistics.TopTwenty.Main;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.TopTwenty.Main
{
    public class ServiceUnitTests
    {
        [Fact]
        public async Task Query_TopTwentyWithAnyCriteria_ReturnRightStatistics()
        {
            // Arrange
            var rawData = TestDataProvider.Load<GenericRawData<TopTwentyRawStatistics>>("full-fake-raw-data");
            var fakeCalculationTopTwentyStatisticsGroup = TestDataProvider.Load<List<UserNameViewGroupStatisticsWithTotalModel>>("fake-calculation-toptwenty-statistic-group");
            var expectedResult = TestDataProvider.Load<List<UserNameViewGroupStatisticsWithTotalModel>>("expected-statistic");

            var rawService = Substitute.For<RawService>();
            rawService.QueryMultipleData<TopTwentyRawStatistics>(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>()).Returns(rawData);

            var calculationService = Substitute.For<CalculationService>();
            calculationService.CalculateTopTwentyStatisticGroup(Arg.Compat.Any<GenericRawData<TopTwentyRawStatistics>>()).Returns(fakeCalculationTopTwentyStatisticsGroup);

            var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService);

            // Act
            var actualResult = await service.Query(Arg.Compat.Any<BaseStatisticCriteria>(), Arg.Compat.Any<DateTime>());

            // Assert
            DeepAssert.Equal(expectedResult, actualResult);
        }
    }
}

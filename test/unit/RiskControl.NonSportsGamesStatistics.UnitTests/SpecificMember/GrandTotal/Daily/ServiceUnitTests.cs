using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Daily;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.GrandTotal.Daily;

using Xunit.Asserts.Compare;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_DailyGrandTotalWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeDailyGrandTotalData = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-daily-grand-total-data");
        var expectedResult = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var dailyGrandTotalService = Substitute.For<GrandTotalService>();
        dailyGrandTotalService.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<NormalCriteria>()).Returns(fakeDailyGrandTotalData);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<BaseStatisticCriteria, HistoryCriteria>();
            cf.CreateMap<BaseStatisticCriteria, NormalCriteria>();
        }).CreateMapper();

        var service = new ServiceImp<BaseStatisticCriteria>(dailyGrandTotalService, mapper);

        // Act
        var actualResult = await service.Query(new HistoryCriteria(), DateTime.Now);

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Daily;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Daily;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_DailyWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeDailyData = TestDataProvider.Load<DailyViewReportModel>("fake-daily-data");
        var expectedResult = TestDataProvider.Load<DailyViewReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var dailyService = Substitute.For<DailyService>();
        dailyService.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<NormalCriteria>()).Returns(fakeDailyData);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<BaseStatisticCriteria, HistoryCriteria>();
            cf.CreateMap<BaseStatisticCriteria, NormalCriteria>();
        }).CreateMapper();

        var service = new ServiceImp<HistoryCriteria>(dailyService, mapper);

        // Act
        var actualResult = await service.Query(new HistoryCriteria(), DateTime.Now);

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
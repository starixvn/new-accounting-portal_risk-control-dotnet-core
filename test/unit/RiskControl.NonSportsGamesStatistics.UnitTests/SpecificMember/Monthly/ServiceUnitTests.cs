using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Monthly;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_MonthlyWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeMonthlyRawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("fake-monthly-data");
        var expectedResult = TestDataProvider.Load<DailyViewReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var rawService = Substitute.For<RawService>();
        rawService.QueryDataFromBettransAndWarehouse<BaseRawStatistic>(
            Arg.Compat.Any<HistoryCriteria>(),
            Arg.Compat.Any<NormalCriteria>()).Returns(fakeMonthlyRawData);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<BaseRawStatistic, DailyViewStatisticsModel>();
            cf.CreateMap<BaseStatisticCriteria, HistoryCriteria>();
            cf.CreateMap<BaseStatisticCriteria, NormalCriteria>();
        }).CreateMapper();

        var calculationService = new CalculationServiceImp(mapper);

        var service = new ServiceImp<BaseStatisticCriteria>(rawService, calculationService, mapper);

        // Act
        var actualResult = await service.Query(new HistoryCriteria(), DateTime.Now);

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
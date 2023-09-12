using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Product;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.GrandTotal.Product;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_ProductGrandTotalWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeProductGrandTotalData = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-product-grand-total-data");
        var expectedResult = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var dailyGrandTotalService = Substitute.For<GrandTotalService>();
        dailyGrandTotalService.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<NormalCriteria>()).Returns(fakeProductGrandTotalData);

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
using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.CasinoProduct;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.GrandTotal.CasinoProduct;

using Xunit.Asserts.Compare;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_CasinoGrandTotalWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeCasinoGrandTotalData = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("fake-casino-grand-total-data");
        var expectedResult = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var grandTotalService = Substitute.For<GrandTotalService>();
        grandTotalService.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<NormalCriteria>()).Returns(fakeCasinoGrandTotalData);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<BaseStatisticCriteria, HistoryCriteria>();
            cf.CreateMap<BaseStatisticCriteria, NormalCriteria>();
        }).CreateMapper();

        var service = new ServiceImp<HistoryCriteria>(grandTotalService, mapper);

        // Act
        var actualResult = await service.Query(new HistoryCriteria(), DateTime.Now);

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
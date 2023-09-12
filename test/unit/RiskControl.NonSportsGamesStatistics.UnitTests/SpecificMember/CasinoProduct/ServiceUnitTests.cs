using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.CasinoProduct;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.UnitTest.Core.TestUtilities;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.CasinoProduct;

using Xunit.Asserts.Compare;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_CasinoProductWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeCasinoProductData = TestDataProvider.Load<DailyViewReportModel>("fake-product-data");
        var expectedResult = TestDataProvider.Load<DailyViewReportModel>("expected-statistic");

        var dailyService = Substitute.For<DailyService>();
        dailyService.Query(Arg.Compat.Any<HistoryCriteria>(), Arg.Compat.Any<NormalCriteria>()).Returns(fakeCasinoProductData);

        var mapper = new MapperConfiguration(cf => {
            cf.CreateMap<BaseStatisticCriteria, HistoryCriteria>();
            cf.CreateMap<BaseStatisticCriteria, NormalCriteria>();
        }).CreateMapper();

        var service = new ServiceImp<BaseStatisticCriteria>(dailyService, mapper);

        // Act
        var actualResult = await service.Query(new HistoryCriteria(), DateTime.Now);

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
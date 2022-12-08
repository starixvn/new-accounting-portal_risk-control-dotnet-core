using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Common
{
    public class GrandTotalServiceUnitTests
    {
        [Fact]
        public async Task Query_GrandTotalWithAnyCriteria_ReturnRightStatistics()
        {
            // Arrange
            var fakeRawData = TestDataProvider.Load<GenericRawData<BaseRawStatistic>>("full-fake-raw-data");
            var expectedResult = TestDataProvider.Load<CurrencyViewStatisticsReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

            var rawService = Substitute.For<RawService>();
            rawService.QueryDataFromBettransAndWarehouse<BaseRawStatistic>(
                Arg.Compat.Any<BaseHistoryCriteria>(),
                Arg.Compat.Any<BaseNormalCriteria>()).Returns(fakeRawData);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<BaseRawStatistic, DailyViewStatisticsModel>();
            }).CreateMapper();

            var calculationService = new CalculationServiceImp(mapper);

            var service = new GrandTotalServiceImp(rawService, calculationService);

            // Act
            var actualResult = await service.Query(new BaseHistoryCriteria(), new BaseNormalCriteria());

            // Assert
            DeepAssert.Equal(expectedResult, actualResult);
        }
    }
}

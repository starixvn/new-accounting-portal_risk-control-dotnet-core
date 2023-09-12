using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Common;

public class UsernameServiceUnitTests
{
    [Fact]
    public async Task Query_UsernameWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var fakeRawData = TestDataProvider.Load<GenericRawData<UserNameViewRawStatistics>>("full-fake-raw-data");
        var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-statistic", dateTimeFormat: "MMM dd, yyyy");

        var rawService = Substitute.For<RawService>();
        rawService.QueryDataFromBettransAndWarehouse<UserNameViewRawStatistics>(
            Arg.Compat.Any<UsernameHistoryCriteria>(),
            Arg.Compat.Any<UsernameNormalCriteria>()).Returns(fakeRawData);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<BaseRawStatistic, DailyViewStatisticsModel>();
            cf.CreateMap<BaseRawStatistic, UserNameViewRawStatistics>();
            cf.CreateMap<UserNameViewRawStatistics, UserNameViewStatisticsModel>();
        }).CreateMapper();

        var calculationService = new CalculationServiceImp(mapper);

        var service = new UsernameServiceImp(rawService, calculationService, mapper);

        // Act
        var actualResult = await service.Query(new UsernameHistoryCriteria(), new UsernameNormalCriteria());

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
    }
}
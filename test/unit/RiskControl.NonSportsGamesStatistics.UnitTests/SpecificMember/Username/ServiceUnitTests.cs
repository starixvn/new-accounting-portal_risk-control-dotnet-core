using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Username;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Username
{
    public class ServiceUnitTests
    {
        [Fact]
        public async Task Query_MainViewWithAnyCriteria_ReturnRightStatistics()
        {
            // Arrange
            var fakeData = TestDataProvider.Load<UserNameViewReportModel>("fake-data");
            var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-data", dateTimeFormat: "MMM dd, yyyy");

            var usernameService = Substitute.For<UsernameService>();
            usernameService.Query(Arg.Compat.Any<UsernameHistoryCriteria>(), Arg.Compat.Any<UsernameNormalCriteria>()).Returns(fakeData);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<BaseStatisticCriteria, UsernameHistoryCriteria>();
                cf.CreateMap<BaseStatisticCriteria, UsernameNormalCriteria>();
            }).CreateMapper();

            var service = new ServiceImp<BaseStatisticCriteria>(usernameService, mapper);

            // Act
            var actualResult = await service.Query(new UsernameHistoryCriteria(), DateTime.Now);

            // Assert
            DeepAssert.Equal(expectedResult, actualResult);
        }
    }
}

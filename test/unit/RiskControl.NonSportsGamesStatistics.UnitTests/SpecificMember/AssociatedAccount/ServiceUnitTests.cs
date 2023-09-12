using AutoMapper;
using NSubstitute;
using RiskControl.Core.AssociatedAcccount;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.AssociatedAccount;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_AssociatedAccountWithAnyCriteria_ReturnRightStatistics()
    {
        // Arrange
        var expectedResult = TestDataProvider.Load<UserNameViewReportModel>("expected-data", dateTimeFormat: "MMM dd, yyyy");

        var criteria = new BaseStatisticCriteria { CustId = 123 };

        var usernameService = Substitute.For<UsernameService>();
        usernameService.Query(Arg.Compat.Any<UsernameHistoryCriteria>(), Arg.Compat.Any<UsernameNormalCriteria>()).Returns(expectedResult);

        var associatedAccountService = Substitute.For<AssociatedAccountService>();
        var associatedByDeviceList = new List<TopAssociatedAccount> {
            new() { CustId = criteria.CustId, Site = "12Bet", Username = "12BETUUS01001", LastBettingDate = new DateTime(2022, 10, 10) }
        };
        var associatedByManualList = new List<TopAssociatedAccount> {
            new() { CustId = criteria.CustId , Site = "722222", Username = "FYJ8500001", LastBettingDate = new DateTime(2022, 10, 10) }
        };
        var associatedByIpList = new List<TopAssociatedAccount> {
            new() { CustId = criteria.CustId , Site = "733333", Username = "Seantest", LastBettingDate = new DateTime(2022, 10, 10) }
        };
        const string expectedUsernames = "12BETUUS01001,FYJ8500001,Seantest";
        associatedAccountService.GetAssociatedByDevice(criteria.CustId).Returns(associatedByDeviceList);
        associatedAccountService.GetAssociatedByManual(criteria.CustId).Returns(associatedByManualList);
        associatedAccountService.GetAssociateddByIp(criteria.CustId).Returns(associatedByIpList);

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<BaseStatisticCriteria, UsernameHistoryCriteria>();
            cf.CreateMap<BaseStatisticCriteria, UsernameNormalCriteria>();
        }).CreateMapper();

        var service = new ServiceImp<BaseStatisticCriteria>(usernameService, associatedAccountService, mapper);

        // Act
        var actualResult = await service.Query(criteria, new DateTime(2019, 1, 1));

        // Assert
        DeepAssert.Equal(expectedResult, actualResult);
        DeepAssert.Equal(expectedUsernames, criteria.UserName);
    }
}
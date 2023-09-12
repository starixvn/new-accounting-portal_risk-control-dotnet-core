using Fanex.Excel.Models;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.Normal;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.UserNameView.AssociatedAccount.Normal;

public class HandlerUnitTests
{
    [Fact]
    public async Task Handle_AssociatedAccountNormalModeWithAnyQueryModel_ReturnRightGridOptions()
    {
        // Arrange
        var fakeUserNameViewReportModel = TestDataProvider.Load<UserNameViewReportModel>("fake-service-data");
        var fakeGridOptions = TestDataProvider.Load<GridOptions>("fake-gridOptions");
        var expectedGridOptions = TestDataProvider.Load<GridOptions>("expected-gridOptions");

        var service = Substitute.For<Service<UserNameViewReportModel, Criteria>>();
        service.Query(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeUserNameViewReportModel);

        var gridOptionService = Substitute.For<GridOptionBuilderService<UserNameViewReportModel, QueryModel>>();
        gridOptionService.BuildGridOptions(Arg.Compat.Any<UserNameViewReportModel>(), Arg.Compat.Any<QueryModel>()).Returns(fakeGridOptions);

        var handler = new Handler(service, gridOptionService);

        // Act
        var actualResult = await handler.Handle(
            new QueryModel
            {
                WinLostDate = new DateTime(2017, 1, 1),
                IsDrillDown = false,
                RoleId = 1,
                IsGrandTotal = false,
                IsNormalMode = true,
                CustId = 1
            },
            new CancellationToken());

        // Assert
        DeepAssert.Equal(expectedGridOptions, actualResult);
    }
}
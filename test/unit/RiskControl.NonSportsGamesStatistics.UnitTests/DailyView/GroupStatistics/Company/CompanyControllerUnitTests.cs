using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.Company;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.DailyView.GroupStatistics.Company;

public class CompanyControllerUnitTests
{
    [Fact]
    public async Task Query_CompanyAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new CompanyController(mediator);
        await controller.Query(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }

    [Fact]
    public async Task Excel_CompanyHistoryModeAlways_CallMediatorSend()
    {
        // Arrange
        var mediator = Substitute.For<IMediator>();
        var queryModel = new QueryModel();

        // Act
        var controller = new CompanyController(mediator);
        await controller.Excel(queryModel);

        // Assert
        await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
    }
}
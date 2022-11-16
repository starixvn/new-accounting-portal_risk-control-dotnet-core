using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.Monthly
{
    public class SpecificMemberMonthlyControllerUnitTests
    {
        [Fact]
        public async Task Query_MonthlyWithQueryModel_AlwaysCallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new SpecificMemberMonthlyController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_MonthlyWithQueryModel_AlwaysCallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new SpecificMemberMonthlyController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

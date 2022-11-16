using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.SpecificMember.CasinoProduct;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.CasinoProduct
{
    public class SpecificMemberCasinoProductControllerUnitTests
    {
        [Fact]
        public async Task Query_CasinoProductWithQueryModel_AlwaysCallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new SpecificMemberCasinoProductController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_CasinoProductWithQueryModel_AlwaysCallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new SpecificMemberCasinoProductController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

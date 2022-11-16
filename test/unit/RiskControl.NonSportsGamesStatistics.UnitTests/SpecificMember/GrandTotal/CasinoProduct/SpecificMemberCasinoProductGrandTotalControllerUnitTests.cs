using MediatR;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.CasinoProduct;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.SpecificMember.GrandTotal.CasinoProduct
{
    public class SpecificMemberCasinoProductGrandTotalControllerUnitTests
    {
        [Fact]
        public async Task Query_CasinoProductGrandTotalWithQueryModel_AlwaysCallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new SpecificMemberCasinoProductGrandTotalController(mediator);
            await controller.Query(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }

        [Fact]
        public async Task Excel_CasinoProductGrandTotalWithQueryModel_AlwaysCallMediatorSend()
        {
            // Arrange
            var mediator = Substitute.For<IMediator>();
            var queryModel = new QueryModel();

            // Act
            var controller = new SpecificMemberCasinoProductGrandTotalController(mediator);
            await controller.Excel(queryModel);

            // Assert
            await mediator.Received().Send(Arg.Compat.Any<QueryModel>());
        }
    }
}

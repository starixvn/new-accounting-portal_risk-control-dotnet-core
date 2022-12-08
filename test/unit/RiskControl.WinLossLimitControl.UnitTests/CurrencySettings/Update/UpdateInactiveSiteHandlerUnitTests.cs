using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update
{
    public class UpdateInactiveSiteHandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_CallExecuteAsyncFromRepositoryTwoTime()
        {
            // Arrange
            var settings = TestDataProvider.Load<IEnumerable<UpdateInactiveSiteModel>>("update-inactive-site-model");
            var request = new UpdateInactiveSiteRequest { Settings = settings };

            var repository = Substitute.For<IDynamicRepository>();
            repository.ExecuteAsync(Arg.Compat.Any<UpdateInactiveSiteCriteria>()).Returns(0);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<UpdateInactiveSiteModel, UpdateInactiveSiteCriteria>();
            }).CreateMapper();

            // Act
            var handle = new UpdateInactiveSiteHandler(repository, mapper);
            await handle.Handle(request, new CancellationToken());

            // Assert
            await repository.Received(2).ExecuteAsync(Arg.Compat.Any<UpdateInactiveSiteCriteria>());
        }
    }
}

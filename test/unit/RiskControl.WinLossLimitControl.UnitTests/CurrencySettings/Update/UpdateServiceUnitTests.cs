using Fanex.Data.Repository;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update
{
    public class UpdateServiceUnitTests
    {
        [Fact]
        public async Task Execute_Always_CallExecuteAsyncFromRepositoryOnlyOneTime()
        {
            // Arrange
            var currencySettingList = TestDataProvider.Load<List<CurrencySetting>>("currency-setting");

            var repository = Substitute.For<IDynamicRepository>();
            repository.ExecuteAsync(Arg.Compat.Any<UpdateCriteria>()).Returns(0);

            var configuration = Substitute.For<IConfiguration>();
            configuration["ItemsPerBatch"].Returns("200");

            var service = new UpdateServiceImp(repository, configuration);

            // Act
            await service.Execute(currencySettingList, new UserContext());

            // Assert
            await repository.Received().ExecuteAsync(Arg.Compat.Any<UpdateCriteria>());
        }
    }
}

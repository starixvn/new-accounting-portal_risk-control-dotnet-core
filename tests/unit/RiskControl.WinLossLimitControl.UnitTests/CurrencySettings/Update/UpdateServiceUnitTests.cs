using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update
{
    public class UpdateServiceUnitTests
    {
        private static readonly UserContext UserContext = new UserContext { UserId = 0, IP = string.Empty };

        private static readonly List<CurrencySetting> ValidCurrencySetting = new List<CurrencySetting>
        {
            new CurrencySetting
            {
                CurrencyId = 1,
                ProductId = 1,
                SiteId = 1,
                GroupId = 1,
                IsBlockedPlacebetRedLevel = true,
                IsBlockedTransferRedLevel = true,
                BlackLimit = -2,
                GreyLimit = -1,
                OrangeLimit = 1,
                YellowLimit = 2,
                RedLimit = 3
            }
        };

        [Fact]
        public async Task Execute_RepositoryReturnsNoError_ExecuteSuccessfully()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            var service = new UpdateServiceImp(repository);

            // Act
            await service.Execute(ValidCurrencySetting, UserContext);
        }
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Insert
{
    public class InsertServiceImpUnitTests
    {
        private static readonly UserContext UserContext = new UserContext { UserId = 0, IP = string.Empty };

        private static readonly List<PlayerSetting> ValidPlayerSetting = new List<PlayerSetting>
        {
            new PlayerSetting
            {
                CustId = 1,
                CurrencyId = 1,
                ProductId = 1,
                SiteId = 1,
                GroupId = 1,
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

            var service = new InsertServiceImp(repository);

            // Act
            await service.Execute(ValidPlayerSetting, UserContext);
        }
    }
}
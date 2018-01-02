using System.Collections.Generic;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.UnitTests.Services
{
    public class DataTransformServiceUnitTests
    {
        [Fact]
        public void UpdateFromRaw_Always_UpdateRightLimitByLevel()
        {
            // Arrange
            var rawList = CreateRawList();
            var winLossLimit = new CurrencySetting();

            // Act
            var service = new DataTransformServiceImp();
            service.UpdateFromRaw(winLossLimit, rawList);

            // Assert
            var expected = new CurrencySetting
            {
                BlackLimit = -50,
                GreyLimit = -30,
                OrangeLimit = 10,
                YellowLimit = 20,
                RedLimit = 30
            };

            DeepAssert.Equal(winLossLimit, expected);
        }

        private List<WinLossLimitRaw> CreateRawList()
        {
            return new List<WinLossLimitRaw>
            {
                CreateRawWinLossLimit(1, 10),
                CreateRawWinLossLimit(2, 20),
                CreateRawWinLossLimit(3, 30),
                CreateRawWinLossLimit(101, -30),
                CreateRawWinLossLimit(102, -50)
            };
        }

        private WinLossLimitRaw CreateRawWinLossLimit(int level, int limitValue)
        {
            return new CurrencySettingRaw
            {
                LevelId = level,
                MaxWinLimit = limitValue
            };
        }
    }
}
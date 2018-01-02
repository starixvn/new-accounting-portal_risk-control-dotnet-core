using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.PlayerSettings.Update;
using RiskControl.WinLossLimitControl.Services;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Update
{
    public class ValidationServiceUnitTests
    {
        [Fact]
        public async Task Execute_ZeroWinLimit_ReturnsZero()
        {
            // Arrange
            var service = ValidationServiceUnitTestsFactory.CreateValidationService();

            // Act
            var request = ValidationServiceUnitTestsFactory.CreateRequest(1, 0);
            var result = await service.Execute(request);

            // Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData(2, 25, true)]
        [InlineData(1, 15, true)]
        [InlineData(3, 25, true)]
        [InlineData(1, -15, false)]
        [InlineData(2, -15, false)]
        public async Task Execute_NonZeroWinLimit_ReturnsExpectedResult(int level, decimal limitValue, bool expected)
        {
            // Arrange
            var service = ValidationServiceUnitTestsFactory.CreateValidationService();

            // Act
            var request = ValidationServiceUnitTestsFactory.CreateRequest(level, limitValue);
            var result = await service.Execute(request);

            // Assert
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData(101, -40, true)]
        [InlineData(102, -60, true)]
        [InlineData(101, -60, false)]
        [InlineData(102, -20, false)]
        [InlineData(101, 15, false)]
        [InlineData(102, 15, false)]
        public async Task Execute_NonZeroLossLimit_ReturnsExpectedResult(int level, decimal limitValue, bool expected)
        {
            // Arrange
            var service = ValidationServiceUnitTestsFactory.CreateValidationService();

            // Act
            var request = ValidationServiceUnitTestsFactory.CreateRequest(level, limitValue);
            var result = await service.Execute(request);

            // Assert
            Assert.Equal(expected, result);
        }
    }

    internal static class ValidationServiceUnitTestsFactory
    {
        public static List<PlayerSetting> FakeRawPlayerSetting => new List<PlayerSetting>
        {
            new PlayerSetting { LevelId = 1, MaxWinLimit = 10 },
            new PlayerSetting { LevelId = 2, MaxWinLimit = 20 },
            new PlayerSetting { LevelId = 3, MaxWinLimit = 30 },
            new PlayerSetting { LevelId = 101, MaxWinLimit = -30 },
            new PlayerSetting { LevelId = 102, MaxWinLimit = -50 }
        };

        public static Request CreateRequest(int levelId, decimal limitValue)
        {
            return new Request
            {
                LevelId = levelId,
                Limit = limitValue
            };
        }

        public static ValidationService CreateValidationService()
        {
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<PlayerSetting>(Arg.Any<ICriteria>()).Returns(FakeRawPlayerSetting);

            var increamentedSeriesContrainService = new IncreamentedSeriesContrainServiceImp();
            return new ValidationServiceImp(repository, increamentedSeriesContrainService);
        }
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.UnitTests.PlayerSettings.Insert
{
    public class ValidationServiceImpUnitTests
    {
        [Fact]
        public async Task Execute_ViolatedContrainsSettings_ReturnsViolatedContrainsError()
        {
            // Arrange
            // Act
            var playerSettings = ValidationServiceUnitTestsFactory.CreatePlayerSettings(-2);
            var service = ValidationServiceUnitTestsFactory.CreateValidationService(false, new List<CurrencySetting>());
            var result = await service.Execute(playerSettings);

            // Assert
            Assert.Equal(result, ValidationServiceUnitTestsFactory.ViolatedContrainsError);
        }

        [Fact]
        public async Task Execute_UnavailableCurrencySettings_ReturnsUnavailableCurrencySettingsError()
        {
            // Arrange
            // Act
            var playerSettings = ValidationServiceUnitTestsFactory.CreatePlayerSettings(-2);
            var service = ValidationServiceUnitTestsFactory.CreateValidationService(true, new List<CurrencySetting>());
            var result = await service.Execute(playerSettings);

            // Assert
            Assert.Equal(result, ValidationServiceUnitTestsFactory.UnavailableCurrencySettingsError);
        }

        [Fact]
        public async Task Execute_ValidSettings_ReturnsValidResult()
        {
            // Arrange
            var currencySettings = new List<CurrencySetting> { new CurrencySetting() };

            // Act
            var playerSettings = ValidationServiceUnitTestsFactory.CreatePlayerSettings(-2);
            var service = ValidationServiceUnitTestsFactory.CreateValidationService(true, currencySettings);
            var result = await service.Execute(playerSettings);

            // Assert
            Assert.Equal(result, ValidationServiceUnitTestsFactory.ValidResult);
        }
    }

    internal static class ValidationServiceUnitTestsFactory
    {
        public static int ViolatedContrainsError => 1;

        public static int UnavailableCurrencySettingsError => 2;

        public static int ValidResult => 0;

        public static List<PlayerSetting> CreatePlayerSettings(decimal seed)
        {
            var setting = new PlayerSetting
            {
                BlackLimit = seed,
                GreyLimit = seed++,
                OrangeLimit = seed++,
                YellowLimit = seed++,
                RedLimit = seed
            };

            return new List<PlayerSetting>
            {
                setting
            };
        }

        public static ValidationService CreateValidationService(bool increamentedContrainsResult, List<CurrencySetting> currencySettings)
        {
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CurrencySetting>(Arg.Any<ICriteria>()).Returns(currencySettings);

            var increamentedSeriesContrainService = Substitute.For<IncreamentedSeriesContrainService>();
            increamentedSeriesContrainService.IsPositiveIncreamented(Arg.Any<decimal[]>()).Returns(increamentedContrainsResult);
            increamentedSeriesContrainService.IsNegativeIncreamented(Arg.Any<decimal[]>()).Returns(increamentedContrainsResult);

            return new ValidationServiceImp(repository, increamentedSeriesContrainService);
        }
    }
}
using System.Collections.Generic;
using NSubstitute;
using Xunit;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.UnitTests.CurrencySettings.Update
{
    public class ValidationServiceUnitTests
    {
        [Fact]
        public void Execute_ViolatedContrainsSettings_ReturnsViolatedContrainsError()
        {
            // Arrange
            // Act
            var service = ValidationServiceUnitTestsFactory.CreateValidationService(false);
            var settings = ValidationServiceUnitTestsFactory.CreateCurrencySettings(-2);
            var result = service.Execute(settings);

            // Assert
            Assert.Equal(result, ValidationServiceUnitTestsFactory.ViolatedContrainsError);
        }

        [Fact]
        public void Execute_ValidSettings_ReturnsValidResult()
        {
            // Arrange
            // Act
            var service = ValidationServiceUnitTestsFactory.CreateValidationService(true);
            var settings = ValidationServiceUnitTestsFactory.CreateCurrencySettings(-2);
            var result = service.Execute(settings);

            // Assert
            Assert.Equal(result, ValidationServiceUnitTestsFactory.ValidResult);
        }
    }

    internal static class ValidationServiceUnitTestsFactory
    {
        public static int ViolatedContrainsError => 1;

        public static int ValidResult => 0;

        public static List<CurrencySetting> CreateCurrencySettings(decimal seed)
        {
            var setting = new CurrencySetting
            {
                BlackLimit = seed,
                GreyLimit = seed++,
                OrangeLimit = seed++,
                YellowLimit = seed++,
                RedLimit = seed
            };

            return new List<CurrencySetting>
            {
               setting
            };
        }

        public static ValidationService CreateValidationService(bool increamentedContrainsResult)
        {
            var increamentedSeriesContrainService = Substitute.For<IncreamentedSeriesContrainService>();
            increamentedSeriesContrainService.IsNegativeIncreamented(Arg.Any<decimal[]>()).Returns(increamentedContrainsResult);
            increamentedSeriesContrainService.IsPositiveIncreamented(Arg.Any<decimal[]>()).Returns(increamentedContrainsResult);

            return new ValidationServiceImp(increamentedSeriesContrainService);
        }
    }
}
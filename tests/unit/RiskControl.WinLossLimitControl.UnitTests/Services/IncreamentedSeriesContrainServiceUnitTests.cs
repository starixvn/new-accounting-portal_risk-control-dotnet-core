using System.Collections.Generic;
using RiskControl.WinLossLimitControl.Services;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Services
{
    public class IncreamentedSeriesContrainServiceUnitTests
    {
        [Theory]
        [MemberData(nameof(IncreamentedSeriesContrainsTestCases.ValidIncreamentedSeries), MemberType = typeof(IncreamentedSeriesContrainsTestCases))]
        public void IsIncreamented_ValidIncreamentedValues_ReturnsTrue(decimal a, decimal b, decimal c)
        {
            var values = new decimal[] { a, b, c };
            var service = new IncreamentedSeriesContrainServiceImp();
            var result = service.IsIncreamented(values);
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(IncreamentedSeriesContrainsTestCases.InvalidIncreamentedSeries), MemberType = typeof(IncreamentedSeriesContrainsTestCases))]
        public void IsIncreamented_InvalidIncreamentedValues_ReturnsFalse(decimal a, decimal b, decimal c)
        {
            var values = new decimal[] { a, b, c };
            var service = new IncreamentedSeriesContrainServiceImp();
            var result = service.IsIncreamented(values);
            Assert.False(result);
        }

        [Theory]
        [MemberData(nameof(IncreamentedSeriesContrainsTestCases.ValidPositiveIncreamentedSeries), MemberType = typeof(IncreamentedSeriesContrainsTestCases))]
        public void IsPositiveIncreamented_ValidIncreamentedValues_ReturnsTrue(decimal a, decimal b, decimal c)
        {
            var values = new decimal[] { a, b, c };
            var service = new IncreamentedSeriesContrainServiceImp();
            var result = service.IsPositiveIncreamented(values);
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(IncreamentedSeriesContrainsTestCases.InvalidPositiveIncreamentedSeries), MemberType = typeof(IncreamentedSeriesContrainsTestCases))]
        public void IsPositiveIncreamented_InvalidIncreamentedValues_ReturnsFalse(decimal a, decimal b, decimal c)
        {
            var values = new decimal[] { a, b, c };
            var service = new IncreamentedSeriesContrainServiceImp();
            var result = service.IsPositiveIncreamented(values);
            Assert.False(result);
        }

        [Theory]
        [MemberData(nameof(IncreamentedSeriesContrainsTestCases.ValidNegativeIncreamentedSeries), MemberType = typeof(IncreamentedSeriesContrainsTestCases))]
        public void IsNegativeIncreamented_ValidIncreamentedValues_ReturnsTrue(decimal a, decimal b, decimal c)
        {
            var values = new decimal[] { a, b, c };
            var service = new IncreamentedSeriesContrainServiceImp();
            var result = service.IsNegativeIncreamented(values);
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(IncreamentedSeriesContrainsTestCases.InvalidNegativeIncreamentedSeries), MemberType = typeof(IncreamentedSeriesContrainsTestCases))]
        public void IsNegativeIncreamented_InvalidIncreamentedValues_ReturnsFalse(decimal a, decimal b, decimal c)
        {
            var values = new decimal[] { a, b, c };
            var service = new IncreamentedSeriesContrainServiceImp();
            var result = service.IsNegativeIncreamented(values);
            Assert.False(result);
        }
    }

    internal static class IncreamentedSeriesContrainsTestCases
    {
        public static IEnumerable<object[]> ValidIncreamentedSeries
        {
            get
            {
                yield return new object[] { 0, 0, 0 };
                yield return new object[] { 0, 1, 0 };
                yield return new object[] { 0, -1, 2 };
                yield return new object[] { 0, 0, 5 };
                yield return new object[] { -1, 0, 0 };
                yield return new object[] { -1, 0, 5 };
                yield return new object[] { 1, 2, 0 };
                yield return new object[] { -2, -1, 5 };
            }
        }

        public static IEnumerable<object[]> InvalidIncreamentedSeries
        {
            get
            {
                yield return new object[] { -5, 4, 3 };
                yield return new object[] { 5, 0, 4 };
                yield return new object[] { 0, 5, -4 };
                yield return new object[] { 5, -4, 0 };
            }
        }

        public static IEnumerable<object[]> ValidPositiveIncreamentedSeries
        {
            get
            {
                yield return new object[] { 0, 0, 0 };
                yield return new object[] { 0, 1, 0 };
                yield return new object[] { 0, 1, 2 };
                yield return new object[] { 0, 0, 5 };
                yield return new object[] { 1, 0, 0 };
                yield return new object[] { 1, 0, 5 };
                yield return new object[] { 1, 2, 0 };
                yield return new object[] { 1, 2, 5 };
            }
        }

        public static IEnumerable<object[]> InvalidPositiveIncreamentedSeries
        {
            get
            {
                yield return new object[] { 5, 4, 3 };
                yield return new object[] { 5, 0, 4 };
                yield return new object[] { 0, 5, 4 };
                yield return new object[] { 5, 4, 0 };
            }
        }

        public static IEnumerable<object[]> ValidNegativeIncreamentedSeries
        {
            get
            {
                yield return new object[] { 0, 0, 0 };
                yield return new object[] { 0, -1, 0 };
                yield return new object[] { 0, -2, -1 };
                yield return new object[] { 0, 0, -5 };
                yield return new object[] { -1, 0, 0 };
                yield return new object[] { -5, 0, -1 };
                yield return new object[] { -2, -1, 0 };
                yield return new object[] { -5, -2, -1 };
            }
        }

        public static IEnumerable<object[]> InvalidNegativeIncreamentedSeries
        {
            get
            {
                yield return new object[] { -3, -4, -5 };
                yield return new object[] { -4, 0, -5 };
                yield return new object[] { 0, -4, -5 };
                yield return new object[] { -4, -5, 0 };
            }
        }
    }
}
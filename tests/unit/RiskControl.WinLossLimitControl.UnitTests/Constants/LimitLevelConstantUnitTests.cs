using RiskControl.WinLossLimitControl.Configurations;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Constants
{
    public class LimitLevelConstantUnitTests
    {
        [Theory]
        [InlineData(1, true)]
        [InlineData(2, true)]
        [InlineData(3, true)]
        [InlineData(101, false)]
        [InlineData(102, false)]
        [InlineData(6, false)]
        public void IsWinLimitLevel_Test(int level, bool expected)
        {
            var result = LimitLevelConstant.IsWinLimitLevel(level);

            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData(1, false)]
        [InlineData(2, false)]
        [InlineData(3, false)]
        [InlineData(101, true)]
        [InlineData(102, true)]
        [InlineData(6, false)]
        public void IsLossLimitLevel_Test(int level, bool expected)
        {
            var result = LimitLevelConstant.IsLossLimitLevel(level);

            Assert.Equal(expected, result);
        }
    }
}
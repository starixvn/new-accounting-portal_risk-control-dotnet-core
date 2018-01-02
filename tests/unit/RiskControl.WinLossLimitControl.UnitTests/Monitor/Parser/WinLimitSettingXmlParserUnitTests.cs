using RiskControl.WinLossLimitControl.Monitor.Parser;
using Xunit;
using Xunit.Asserts.Compare;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Parser
{
    public class WinLimitSettingXmlParserUnitTests
    {
        [Fact]
        public void Parse_WellFormattedXml_ReturnssRightWinLimitSetting()
        {
            const string Xml = "<MaxWinLimitSetting Level1=\"5000\" Level2=\"10000\" Level3=\"50000\" Level101=\"-40000\" Level102=\"-50000\"/>";
            var expected = new WinLimitSetting
            {
                BlackLimit = -50000m,
                GreyLimit = -40000m,
                OrangeLimit = 5000m,
                YellowLimit = 10000m,
                RedLimit = 50000m
            };

            var parser = new WinLimitSettingXmlParserImp();
            var winLimitSetting = parser.Parse(Xml);

            DeepAssert.Equal(winLimitSetting, expected);
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("<daeraelad>")]
        public void Parse_InvalidXmlFormat_ReturnsZeroValue(string xml)
        {
            var expected = new WinLimitSetting { OrangeLimit = 0, YellowLimit = 0, RedLimit = 0 };

            var parser = new WinLimitSettingXmlParserImp();
            var winLimitSetting = parser.Parse(xml);

            DeepAssert.Equal(winLimitSetting, expected);
        }
    }
}
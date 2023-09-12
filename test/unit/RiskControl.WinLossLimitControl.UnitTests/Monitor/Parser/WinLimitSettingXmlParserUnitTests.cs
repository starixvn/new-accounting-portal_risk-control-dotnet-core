using RiskControl.WinLossLimitControl.Monitor.Parser;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Parser;

using Xunit.Asserts.Compare;

public class WinLimitSettingXmlParserUnitTests
{
    [Fact]
    public void Parse_WellFormattedXml_ReturnssRightWinLimitSetting()
    {
        // Arrange
        const string Xml = "<MaxWinLimitSetting Level1=\"5000\" Level2=\"10000\" Level3=\"50000\" Level101=\"-40000\" Level102=\"-50000\"/>";
        var expected = new WinLimitSetting
        {
            BlackLimit = -50000m,
            GreyLimit = -40000m,
            OrangeLimit = 5000m,
            YellowLimit = 10000m,
            RedLimit = 50000m
        };

        // Act
        var parser = new WinLimitSettingXmlParserImp();
        var winLimitSetting = parser.Parse(Xml);

        // Assert
        DeepAssert.Equal(winLimitSetting, expected);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("<daeraelad>")]
    public void Parse_InvalidXmlFormat_ReturnsZeroValue(string xml)
    {
        // Arrange
        var expected = new WinLimitSetting { OrangeLimit = 0, YellowLimit = 0, RedLimit = 0 };

        // Act
        var parser = new WinLimitSettingXmlParserImp();
        var winLimitSetting = parser.Parse(xml);

        // Assert
        DeepAssert.Equal(winLimitSetting, expected);
    }
}
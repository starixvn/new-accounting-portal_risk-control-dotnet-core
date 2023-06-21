using System;
using System.Globalization;
using System.Xml;
using System.Xml.Linq;

namespace RiskControl.WinLossLimitControl.Monitor.Parser
{
    public interface WinLimitSettingXmlParser
    {
        WinLimitSetting Parse(string xml);
    }

    public class WinLimitSettingXmlParserImp : WinLimitSettingXmlParser
    {
        private const decimal DefaultValue = 0;

        public WinLimitSetting Parse(string xml)
        {
            XDocument document;
            try
            {
                document = XDocument.Parse(xml);
            }
            catch (ArgumentNullException)
            {
                return new WinLimitSetting();
            }
            catch (XmlException)
            {
                return new WinLimitSetting();
            }

            return GetWinLimitSetting(document.Root);
        }

        private static WinLimitSetting GetWinLimitSetting(XElement element)
        {
            return new WinLimitSetting
            {
                BlackLimit = GetAttribute(element, "Level102"),
                GreyLimit = GetAttribute(element, "Level101"),
                OrangeLimit = GetAttribute(element, "Level1"),
                YellowLimit = GetAttribute(element, "Level2"),
                RedLimit = GetAttribute(element, "Level3")
            };
        }

        private static decimal GetAttribute(XElement element, string attributeName)
        {
            var attribute = element.Attribute(attributeName);

            return attribute != null && decimal.TryParse(attribute.Value, NumberStyles.Any, CultureInfo.CurrentCulture.NumberFormat, out _)
                ? decimal.Parse(attribute.Value, CultureInfo.CurrentCulture.NumberFormat)
                : DefaultValue;
        }
    }
}
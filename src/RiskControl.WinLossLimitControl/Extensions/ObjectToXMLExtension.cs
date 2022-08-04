using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;
using System.Collections.Generic;
using System.Text;

namespace RiskControl.WinLossLimitControl.Extensions
{
    public static class ObjectToXMLExtension
    {
        public static string ToCurrencySettingXml(this IEnumerable<UpdateSiteModel> models)
        {
            if (models == null)
            {
                return string.Empty;
            }

            var stringBuilder = new StringBuilder();
            foreach (var model in models)
            {
                var line = $"<r Product='{model.ProductId}' "
                    + $"Group='{model.GroupId}' "
                    + $"Currency='{model.CurrencyId}' "
                    + $"Site='{model.SiteId}' "
                    + $"Level='{model.LevelId}' "
                    + $"WinLimit='{model.MaxWinLimit}' "
                    + $"PlaceBet='{model.IsBlockedPlaceBet}' "
                    + $"Transfer='{model.IsBlockedTransfer}' />";
                stringBuilder.AppendLine(line);
            }

            return $"<Root>{stringBuilder.ToString().Trim()}</Root>";
        }
    }
}

using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Filter.Model;

namespace RiskControl.WinLossLimitControl.UnitTests.Mocks
{
    public class CacheRefServiceMockImp : CacheRefService
    {
        public BaseEntityGroup BaseEntityGroup => new();

        public string GetBetTypeName(int betTypeId)
        {
            return $"B{betTypeId}";
        }

        public string GetCurrencyName(int currencyId)
        {
            return $"C{currencyId}";
        }

        public string GetGroupName(int groupId)
        {
            return $"G{groupId}";
        }

        public string GetProductName(int productId)
        {
            return $"P{productId}";
        }

        public string GetSiteName(int siteId)
        {
            return $"S{siteId}";
        }

        public string GetSportName(int sportId)
        {
            return $"B{sportId}";
        }
    }
}
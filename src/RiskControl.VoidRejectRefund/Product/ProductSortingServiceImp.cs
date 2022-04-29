using System;
using System.Linq;
using RiskControl.Core.Sort;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product
{
    public class ProductSortingServiceImp : SortingService<ProductModel>
    {
        public ProductModel SortData(ProductModel reportModel, string sortDirection, string sortColumnName)
        {
            foreach (var productStatistic in reportModel.ProductStatistics)
            {
                SortStatisticsForPerChildGroup(productStatistic, sortDirection, sortColumnName);
                SortStatisticsForChildGroups(productStatistic, sortDirection, sortColumnName);
            }

            return reportModel;
        }

        private static void SortStatisticsForPerChildGroup(ProductStatistic productStatistic, string sortDirection, string sortColumnName)
        {
            foreach (var row in productStatistic.LeagueSportBettypes)
            {
                Sort.SortByProperty(row.Bettypes, sortDirection, sortColumnName);
            }
        }

        private static void SortStatisticsForChildGroups(ProductStatistic productStatistic, string sortDirection, string sortColumnName)
        {
            var propInfo = typeof(ProductLeagueSportBettypeStatistic).GetProperty(sortColumnName);
            var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
            productStatistic.LeagueSportBettypes = isAsc ?
            productStatistic
                .LeagueSportBettypes
                .OrderBy(s => propInfo.GetValue(s.Total, null))
                .ToList() :
            productStatistic
                 .LeagueSportBettypes
                .OrderByDescending(s => propInfo.GetValue(s.Total, null))
                .ToList();
        }
    }
}

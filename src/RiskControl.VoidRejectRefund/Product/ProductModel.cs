using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Product
{
    public class ProductModel
    {
        public List<ProductStatistic> ProductStatistics { get; set; }

        public ProductLeagueSportBettypeStatistic GrandTotal { get; set; }
    }
}

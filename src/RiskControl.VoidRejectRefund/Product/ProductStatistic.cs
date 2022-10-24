using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Product
{
    public class ProductStatistic
    {
        public ProductLeagueSportBettypeStatistic Total { get; set; }

        public List<LeagueSportBettypeStatistic> LeagueSportBettypes { get; set; }
    }
}

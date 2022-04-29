using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common
{
    public class StatisticReportModel
    {
        public List<StatisticModel> Statistics { get; set; }

        public StatisticModel GrandTotal { get; set; }
    }
}

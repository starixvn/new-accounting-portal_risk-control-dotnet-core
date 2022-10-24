using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common
{
    public class ChildGroupStatisticModel
    {
        public string GroupName { get; set; }

        public List<StatisticModel> Statistics { get; set; }
    }
}

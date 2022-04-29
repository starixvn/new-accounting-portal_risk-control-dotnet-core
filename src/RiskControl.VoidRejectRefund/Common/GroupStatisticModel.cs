using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common
{
    public class GroupStatisticModel
    {

        public StatisticModel Total { get; set; }

        public List<ChildGroupStatisticModel> Statistics { get; set; }
    }
}

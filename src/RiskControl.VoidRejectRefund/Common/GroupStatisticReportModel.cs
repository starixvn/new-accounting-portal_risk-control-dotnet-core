using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common;

public class GroupStatisticReportModel
{
    public List<GroupStatisticModel> Statistics { get; set; }

    public StatisticModel GrandTotal { get; set; }
}
using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common;

public class StatisticExcelReportModel
{
    public List<StatisticExcelModel> Statistics { get; set; }

    public StatisticExcelModel GrandTotal { get; set; }
}